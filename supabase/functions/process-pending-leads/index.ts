import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const ALLOWED_WEBHOOK_HOST = "hooks.zapier.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Backend configuration is missing" }, 500);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: pending, error } = await admin
    .from("lead_schedule_tracking")
    .select("id,payload,webhook_url")
    .eq("status", "Pending")
    .lte("due_at", new Date().toISOString())
    .limit(100);

  if (error) {
    console.error("Unable to read pending leads", error);
    return json({ error: "Unable to read pending leads" }, 500);
  }

  let processed = 0;

  // Retry leads whose Zapier delivery failed.
  const { data: retries } = await admin
    .from("lead_schedule_tracking")
    .select("id,payload,webhook_url")
    .eq("status", "Forward Retry")
    .lte("due_at", new Date(Date.now() - 60_000).toISOString())
    .limit(100);
  for (const lead of retries ?? []) {
    try {
      const url = new URL(lead.webhook_url);
      if (url.protocol !== "https:" || url.hostname !== ALLOWED_WEBHOOK_HOST) continue;
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead.payload),
      });
      if (res.ok) {
        await admin.from("lead_schedule_tracking")
          .update({ status: "Forwarded", processed_at: new Date().toISOString() })
          .eq("id", lead.id).eq("status", "Forward Retry");
        processed += 1;
      } else {
        console.error("Zapier retry failed", res.status, await res.text());
      }
    } catch (e) {
      console.error("Zapier retry error", e);
    }
  }
  for (const lead of pending ?? []) {
    const url = new URL(lead.webhook_url);
    if (url.protocol !== "https:" || url.hostname !== ALLOWED_WEBHOOK_HOST) continue;

    const now = new Date().toISOString();
    const { data: claimed, error: claimError } = await admin
      .from("lead_schedule_tracking")
      .update({ status: "Not Scheduled", processed_at: now })
      .eq("id", lead.id)
      .eq("status", "Pending")
      .select("id")
      .maybeSingle();
    if (claimError || !claimed) {
      if (claimError) console.error("Unable to claim pending lead", claimError);
      continue;
    }

    const payload = {
      ...(lead.payload as Record<string, unknown>),
      "Call Scheduled": "Not Scheduled",
      trackingEvent: "call_not_scheduled",
      trackingId: lead.id,
      statusUpdatedAt: now,
    };
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Zapier pending update failed", response.status, await response.text());
      await admin
        .from("lead_schedule_tracking")
        .update({ status: "Pending", processed_at: null })
        .eq("id", lead.id)
        .eq("status", "Not Scheduled");
      continue;
    }
    processed += 1;
  }

  return json({ ok: true, processed });
});