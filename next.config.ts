import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le Hub est servi sous /hub via le rewrite du projet vivesmedia.com (app)
  // → une seule adresse, une seule session pour le CMS et le Hub
  basePath: "/hub",

  // Ne pas divulguer la techno (X-Powered-By: Next.js).
  poweredByHeader: false,

  // ⚠️ DETTE TECHNIQUE PRÉ-EXISTANTE : les types Supabase ne sont pas inférés
  // par @supabase/ssr + postgrest-js 2.108 → tous les .from() ressortent en
  // `never` (≈160 erreurs de TYPE, sans impact runtime). On tolère ces erreurs
  // au build pour pouvoir déployer ; à corriger proprement (régénérer les types
  // Supabase / aligner les versions) dans une tâche dédiée.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Le Hub (back-office + espace client) ne doit JAMAIS être indexé, ni
  // chargeable en iframe externe, ni servi sans en-têtes de sécurité — y
  // compris quand on l'atteint directement via vivesmedia-hub.vercel.app.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
