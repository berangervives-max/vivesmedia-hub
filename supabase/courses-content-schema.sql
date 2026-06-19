-- vivesmedia Hub — Contenu des cours éditable en base
-- Run AFTER schema.sql + rls.sql + courses-schema.sql.
-- 1 ligne = 1 cours ; `data` = l'objet Course complet (cf. lib/courses/types.ts).
-- Le code (lib/courses) sert de seed/fallback ; l'admin édite ces lignes.

CREATE TABLE IF NOT EXISTS courses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  data        JSONB NOT NULL DEFAULT '{}'::jsonb,
  published   BOOLEAN NOT NULL DEFAULT true,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_position ON courses (position);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Admin : tout. Lecture publique des cours publiés (pour l'espace client).
DROP POLICY IF EXISTS "admin_all_courses" ON courses;
CREATE POLICY "admin_all_courses" ON courses
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "read_published_courses" ON courses;
CREATE POLICY "read_published_courses" ON courses
  FOR SELECT TO authenticated USING (published = true);
