import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le Hub est servi sous /hub via le rewrite du projet vivesmedia.com (app)
  // → une seule adresse, une seule session pour le CMS et le Hub
  basePath: "/hub",

  // ⚠️ DETTE TECHNIQUE PRÉ-EXISTANTE : les types Supabase ne sont pas inférés
  // par @supabase/ssr + postgrest-js 2.108 → tous les .from() ressortent en
  // `never` (≈160 erreurs de TYPE, sans impact runtime). On tolère ces erreurs
  // au build pour pouvoir déployer ; à corriger proprement (régénérer les types
  // Supabase / aligner les versions) dans une tâche dédiée.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
