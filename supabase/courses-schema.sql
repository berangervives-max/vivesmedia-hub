-- vivesmedia Hub Client — Espace Formations (cours e-learning)
-- Run AFTER schema.sql and rls.sql (réutilise is_admin() et my_client_id()).
-- Le CONTENU des cours (modules/leçons/quiz) vit dans le code (lib/courses/*).
-- Ces tables ne stockent que l'ÉTAT par utilisateur + les accès.

-- ─── TABLES ──────────────────────────────────────────────────────────────────

-- Accès d'un client à un cours (posé par l'admin après paiement)
CREATE TABLE IF NOT EXISTS course_enrollments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  granted_by  UUID,
  granted_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (client_id, course_slug)
);

-- Progression : une ligne = une leçon terminée
CREATE TABLE IF NOT EXISTS lesson_progress (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  course_slug  TEXT NOT NULL,
  lesson_id    TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (client_id, lesson_id)
);

-- Prise de notes : une note par (client, leçon)
CREATE TABLE IF NOT EXISTS course_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  lesson_id   TEXT NOT NULL,
  content     TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (client_id, lesson_id)
);

-- Tentatives de quiz
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  course_slug  TEXT NOT NULL,
  quiz_id      TEXT NOT NULL,
  score        INTEGER NOT NULL,
  total        INTEGER NOT NULL,
  answers      JSONB NOT NULL DEFAULT '[]'::jsonb,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEX ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_enroll_client   ON course_enrollments (client_id);
CREATE INDEX IF NOT EXISTS idx_progress_client ON lesson_progress (client_id, course_slug);
CREATE INDEX IF NOT EXISTS idx_notes_client    ON course_notes (client_id, course_slug);
CREATE INDEX IF NOT EXISTS idx_quiz_client     ON quiz_attempts (client_id, course_slug);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_notes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts      ENABLE ROW LEVEL SECURITY;

-- Enrollments : admin gère tout ; client lit seulement ses accès
DROP POLICY IF EXISTS "admin_all_enroll" ON course_enrollments;
CREATE POLICY "admin_all_enroll" ON course_enrollments
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "client_select_enroll" ON course_enrollments;
CREATE POLICY "client_select_enroll" ON course_enrollments
  FOR SELECT TO authenticated USING (client_id = my_client_id());

-- Progress : admin tout ; client gère les siens
DROP POLICY IF EXISTS "admin_all_progress" ON lesson_progress;
CREATE POLICY "admin_all_progress" ON lesson_progress
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "client_own_progress" ON lesson_progress;
CREATE POLICY "client_own_progress" ON lesson_progress
  FOR ALL TO authenticated
  USING (client_id = my_client_id()) WITH CHECK (client_id = my_client_id());

-- Notes : admin tout ; client gère les siennes
DROP POLICY IF EXISTS "admin_all_notes" ON course_notes;
CREATE POLICY "admin_all_notes" ON course_notes
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "client_own_notes" ON course_notes;
CREATE POLICY "client_own_notes" ON course_notes
  FOR ALL TO authenticated
  USING (client_id = my_client_id()) WITH CHECK (client_id = my_client_id());

-- Quiz attempts : admin tout ; client gère les siennes
DROP POLICY IF EXISTS "admin_all_quiz" ON quiz_attempts;
CREATE POLICY "admin_all_quiz" ON quiz_attempts
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "client_own_quiz" ON quiz_attempts;
CREATE POLICY "client_own_quiz" ON quiz_attempts
  FOR ALL TO authenticated
  USING (client_id = my_client_id()) WITH CHECK (client_id = my_client_id());
