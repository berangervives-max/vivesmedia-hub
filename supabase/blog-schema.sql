-- ============================================================================
-- vivesmedia Hub — Blog (table site_articles)
-- Source unique partagée : back-office (Hub admin) + front public (vivesmedia.com)
-- À exécuter dans Supabase → SQL Editor → New query (une seule fois)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS site_articles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  titre       TEXT NOT NULL,
  categorie   TEXT,
  extrait     TEXT,
  contenu     TEXT,                  -- Markdown (rendu par ReactMarkdown sur le front)
  image_url   TEXT,                  -- URL publique Storage (héros)
  tags        TEXT,                  -- liste séparée par des virgules
  publie      BOOLEAN NOT NULL DEFAULT false,
  date_pub    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS site_articles_date_idx   ON site_articles (date_pub DESC);
CREATE INDEX IF NOT EXISTS site_articles_publie_idx ON site_articles (publie);

-- ─── RLS : lecture publique des articles publiés ; écriture via service_role ───
ALTER TABLE site_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_articles_public_read" ON site_articles;
CREATE POLICY "site_articles_public_read"
  ON site_articles FOR SELECT
  USING (publie = true);
-- (les API admin du Hub et le seed utilisent la clé service_role, qui bypasse la RLS)

-- ─── Storage : bucket public "blog" (héros + visuels inline) ──────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "blog_public_read" ON storage.objects;
CREATE POLICY "blog_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog');
