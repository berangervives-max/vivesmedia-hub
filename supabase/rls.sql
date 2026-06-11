-- vivesmedia Hub Client — Row Level Security Policies
-- Run AFTER schema.sql

-- ─── ENABLE RLS ──────────────────────────────────────────────────────────────

ALTER TABLE clients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_history     ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_forms  ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE files             ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_videos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

-- ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION my_client_id()
RETURNS UUID AS $$
  SELECT id FROM clients WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── CLIENTS ─────────────────────────────────────────────────────────────────

CREATE POLICY "admin_all_clients" ON clients
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "client_select_own" ON clients
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ─── PROJECTS ────────────────────────────────────────────────────────────────

CREATE POLICY "admin_all_projects" ON projects
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "client_select_own_projects" ON projects
  FOR SELECT TO authenticated USING (client_id = my_client_id());

-- ─── PHASE_HISTORY ───────────────────────────────────────────────────────────

CREATE POLICY "admin_all_phase_history" ON phase_history
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "client_select_phase_history" ON phase_history
  FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE client_id = my_client_id()));

-- ─── ONBOARDING_FORMS ────────────────────────────────────────────────────────

CREATE POLICY "admin_all_forms" ON onboarding_forms
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "client_select_forms" ON onboarding_forms
  FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE client_id = my_client_id()));

-- ─── FORM_RESPONSES ──────────────────────────────────────────────────────────

CREATE POLICY "admin_all_responses" ON form_responses
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "client_own_responses" ON form_responses
  FOR ALL TO authenticated
  USING (client_id = my_client_id()) WITH CHECK (client_id = my_client_id());

-- ─── FILES ───────────────────────────────────────────────────────────────────

CREATE POLICY "admin_all_files" ON files
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "client_select_files" ON files
  FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE client_id = my_client_id()));

-- ─── TRAINING_VIDEOS ─────────────────────────────────────────────────────────

CREATE POLICY "admin_all_videos" ON training_videos
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "client_select_videos" ON training_videos
  FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE client_id = my_client_id()));

-- ─── TICKETS ─────────────────────────────────────────────────────────────────

CREATE POLICY "admin_all_tickets" ON tickets
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "client_own_tickets" ON tickets
  FOR ALL TO authenticated
  USING (client_id = my_client_id()) WITH CHECK (client_id = my_client_id());

-- ─── TICKET_MESSAGES ─────────────────────────────────────────────────────────

CREATE POLICY "admin_all_messages" ON ticket_messages
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "client_select_messages" ON ticket_messages
  FOR SELECT TO authenticated
  USING (ticket_id IN (SELECT id FROM tickets WHERE client_id = my_client_id()));

CREATE POLICY "client_insert_messages" ON ticket_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND ticket_id IN (SELECT id FROM tickets WHERE client_id = my_client_id())
  );

-- ─── NOTIFICATIONS_LOG ───────────────────────────────────────────────────────

CREATE POLICY "admin_all_notifications" ON notifications_log
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ─── STORAGE RLS ─────────────────────────────────────────────────────────────
-- Run in Storage policies

-- Allow admin to upload
-- CREATE POLICY "admin_upload" ON storage.objects FOR INSERT TO authenticated
--   USING (bucket_id = 'hub-files' AND is_admin());

-- Allow clients to read their own files
-- CREATE POLICY "client_read_files" ON storage.objects FOR SELECT TO authenticated
--   USING (bucket_id = 'hub-files' AND (
--     is_admin() OR
--     (storage.foldername(name))[1] IN (
--       SELECT id::text FROM projects WHERE client_id = my_client_id()
--     )
--   ));
