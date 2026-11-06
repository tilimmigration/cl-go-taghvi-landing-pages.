CREATE POLICY "Backend manages lead schedule tracking"
ON public.lead_schedule_tracking
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);