CREATE TABLE public.lead_schedule_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  payload jsonb NOT NULL,
  webhook_url text NOT NULL,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Scheduled', 'Not Scheduled')),
  due_at timestamptz NOT NULL DEFAULT (now() + interval '2 minutes'),
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.lead_schedule_tracking TO service_role;

ALTER TABLE public.lead_schedule_tracking ENABLE ROW LEVEL SECURITY;

CREATE INDEX lead_schedule_tracking_pending_due_idx
  ON public.lead_schedule_tracking (due_at)
  WHERE status = 'Pending';

CREATE OR REPLACE FUNCTION public.update_lead_schedule_tracking_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_lead_schedule_tracking_updated_at
BEFORE UPDATE ON public.lead_schedule_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_lead_schedule_tracking_updated_at();