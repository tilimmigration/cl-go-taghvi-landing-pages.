import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  validateLeadFields,
  normalizeName,
  normalizeEmail,
} from "../_shared/leadValidation.ts";

const ALLOWED_WEBHOOK_HOST = "hooks.zapier.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return json({ ok: false, errors: { form: "Invalid request body" } }, 400);
    }

    const { webhookUrl, payload, trackingId } = body as {
      webhookUrl?: string;
      payload?: Record<string, unknown>;
      trackingId?: string;
    };
    if (!payload || typeof payload !== "object") {
      return json({ ok: false, errors: { form: "Missing payload" } }, 400);
    }

    // Field-level validation (authoritative)
    const candidate = {
      firstName: payload.firstName ?? payload["First Name"],
      lastName: payload.lastName ?? payload["Last Name"],
      fullName: payload.fullName ?? payload["Full Name"],
      email: payload.email ?? payload["Email Address"],
    } as Record<string, unknown>;
    Object.keys(candidate).forEach((k) => {
      if (candidate[k] === undefined) delete candidate[k];
    });

    // Every lead must include an email and either a full name or first/last
    // names. This prevents callers from bypassing validation by omitting keys.
    if (candidate.email === undefined) {
      return json({ ok: false, errors: { email: "Email address is required" } }, 400);
    }
    if (candidate.fullName === undefined && candidate.firstName === undefined) {
      return json({ ok: false, errors: { firstName: "First name is required" } }, 400);
    }
    if (candidate.firstName !== undefined && candidate.lastName === undefined) {
      return json({ ok: false, errors: { lastName: "Last name is required" } }, 400);
    }

    const errors = validateLeadFields(candidate);
    if (Object.keys(errors).length > 0) {
      // 200 so the client can read field errors from the response body
      return json({ ok: false, errors });
    }

    // Normalize before forwarding / storing
    const clean: Record<string, unknown> = { ...payload };
    const setIf = (key: string, value: unknown) => {
      if (clean[key] !== undefined) clean[key] = value;
    };
    setIf("firstName", normalizeName(String(candidate.firstName ?? "")));
    setIf("First Name", normalizeName(String(candidate.firstName ?? "")));
    setIf("lastName", normalizeName(String(candidate.lastName ?? "")));
    setIf("Last Name", normalizeName(String(candidate.lastName ?? "")));
    setIf("fullName", normalizeName(String(candidate.fullName ?? "")));
    setIf("Full Name", normalizeName(String(candidate.fullName ?? "")));
    setIf("email", normalizeEmail(String(candidate.email ?? "")));
    setIf("Email Address", normalizeEmail(String(candidate.email ?? "")));

    // Record when the lead was submitted (Pacific Time) unless provided.
    if (clean["Submitted On"] === undefined && clean.submittedOn === undefined) {
      clean["Submitted On"] = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()) + " PT";
    }

    const isInitialCaseSubmission = clean.trackingEvent === "case_info_submitted";
    const isScheduledUpdate = clean.trackingEvent === "call_scheduled";
    if (isInitialCaseSubmission) clean["Call Scheduled"] = "Pending";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const admin = supabaseUrl && serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
      : null;

    if (isScheduledUpdate && admin && typeof trackingId === "string") {
      const { error: trackingError } = await admin
        .from("lead_schedule_tracking")
        .update({ status: "Scheduled", processed_at: new Date().toISOString() })
        .eq("id", trackingId);
      if (trackingError) console.error("Unable to mark lead scheduled", trackingError);
      clean.trackingId = trackingId;
    }

    // Validate the webhook now, but hold initial case submissions in the
    // tracking table until their final booking status is known. This prevents
    // Zapier/Google Sheets from creating a Pending row and then a second final
    // status row for the same lead.
    let forwarded = false;
    if (typeof webhookUrl === "string" && webhookUrl) {
      let url: URL | null = null;
      try {
        url = new URL(webhookUrl);
      } catch {
        url = null;
      }
      if (!url || url.protocol !== "https:" || url.hostname !== ALLOWED_WEBHOOK_HOST) {
        return json({ ok: false, errors: { form: "Invalid webhook URL" } }, 400);
      }
      if (!isInitialCaseSubmission) {
        // Save every lead first so nothing is lost if Zapier is slow or down.
        let backupId: string | null = null;
        if (admin && !isScheduledUpdate) {
          const { data: saved, error: saveError } = await admin
            .from("lead_schedule_tracking")
            .insert({
              email: normalizeEmail(String(candidate.email)),
              payload: clean,
              webhook_url: url.toString(),
              status: "Forward Retry",
              due_at: new Date().toISOString(),
            })
            .select("id")
            .single();
          if (saveError) console.error("Unable to back up lead", saveError);
          backupId = saved?.id ?? null;
        }
        for (let attempt = 0; attempt < 3 && !forwarded; attempt++) {
          try {
            const res = await fetch(url.toString(), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(clean),
            });
            forwarded = res.ok;
            if (!res.ok) console.error("Zapier forward failed", res.status, await res.text());
          } catch (e) {
            console.error("Zapier forward error", e);
          }
          if (!forwarded) await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        }
        if (backupId && admin) {
          if (forwarded) {
            await admin.from("lead_schedule_tracking")
              .update({ status: "Forwarded", processed_at: new Date().toISOString() })
              .eq("id", backupId);
          }
          // Saved for automatic retry; let the visitor continue.
          forwarded = true;
        }
        if (!forwarded) {
          return json({ ok: false, forwarded: false, errors: { form: "Unable to submit lead" } }, 502);
        }
      }
    }

    if (!forwarded && !isInitialCaseSubmission) {
      return json({ ok: false, forwarded: false, errors: { form: "Missing webhook URL" } }, 400);
    }

    let createdTrackingId: string | null = null;
    if (isInitialCaseSubmission) {
      if (!admin) return json({ ok: false, errors: { form: "Tracking configuration is missing" } }, 500);
      const { data: tracking, error: trackingError } = await admin
        .from("lead_schedule_tracking")
        .insert({
          email: normalizeEmail(String(candidate.email)),
          payload: clean,
          webhook_url: webhookUrl,
          status: "Pending",
        })
        .select("id")
        .single();
      if (trackingError) {
        console.error("Unable to create lead tracking", trackingError);
        return json({ ok: false, errors: { form: "Unable to start booking tracking" } }, 500);
      }
      createdTrackingId = tracking.id;
    }

    return json({ ok: true, forwarded, trackingId: createdTrackingId });
  } catch (err) {
    console.error("validate-lead error", err);
    return json({ ok: false, errors: { form: "Unexpected server error" } }, 500);
  }
});
