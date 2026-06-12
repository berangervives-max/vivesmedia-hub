import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le Hub est servi sous /hub via le rewrite du projet vivesmedia.com (app)
  // → une seule adresse, une seule session pour le CMS et le Hub
  basePath: "/hub",
};

export default nextConfig;
