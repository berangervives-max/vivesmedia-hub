-- vivesmedia Hub Client — Supabase Schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUM TYPES ─────────────────────────────────────────────────────────────

CREATE TYPE project_phase AS ENUM (
  'onboarding', 'design', 'dev', 'recette', 'livraison', 'maintenance'
);

CREATE TYPE file_category AS ENUM ('file', 'maquette', 'invoice');

CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high');

CREATE TYPE notification_type AS ENUM (
  'phase_change', 'new_file', 'review_request', 'ticket_reply'
);

-- ─── TABLES ─────────────────────────────────────────────────────────────────

CREATE TABLE clients (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  company    TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  current_phase   project_phase NOT NULL DEFAULT 'onboarding',
  is_maintenance  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE phase_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase       project_phase NOT NULL,
  changed_by  UUID NOT NULL REFERENCES auth.users(id),
  note        TEXT,
  changed_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE onboarding_forms (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  title      TEXT NOT NULL,
  fields     JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE form_responses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id      UUID NOT NULL REFERENCES onboarding_forms(id) ON DELETE CASCADE,
  client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  responses    JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_complete  BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ,
  UNIQUE(form_id, client_id)
);

CREATE TABLE files (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  category     file_category NOT NULL DEFAULT 'file',
  storage_path TEXT NOT NULL,
  uploaded_by  UUID NOT NULL REFERENCES auth.users(id),
  uploaded_at  TIMESTAMPTZ DEFAULT NOW(),
  size_bytes   INTEGER
);

CREATE TABLE training_videos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  url         TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tickets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  status      ticket_status NOT NULL DEFAULT 'open',
  priority    ticket_priority NOT NULL DEFAULT 'medium',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id  UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES auth.users(id),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type            notification_type NOT NULL,
  recipient_email TEXT NOT NULL,
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_projects_client_id        ON projects(client_id);
CREATE INDEX idx_phase_history_project_id  ON phase_history(project_id);
CREATE INDEX idx_files_project_id          ON files(project_id);
CREATE INDEX idx_training_videos_project   ON training_videos(project_id);
CREATE INDEX idx_tickets_project_id        ON tickets(project_id);
CREATE INDEX idx_tickets_client_id         ON tickets(client_id);
CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- ─── AUTO UPDATE updated_at ──────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tickets_updated_at
  BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── STORAGE BUCKET ──────────────────────────────────────────────────────────
-- Run separately in Supabase Dashboard → Storage → Create bucket
-- Name: hub-files | Public: false

-- INSERT INTO storage.buckets (id, name, public) VALUES ('hub-files', 'hub-files', false);
