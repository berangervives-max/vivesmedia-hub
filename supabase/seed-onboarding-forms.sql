-- ─────────────────────────────────────────────────────────────────────────
-- SEED : Templates de formulaires d'onboarding
-- Usage : Exécuter dans Supabase SQL Editor sur un projet existant
--
-- IMPORTANT : Remplacer :project_id par l'UUID réel du projet cible
-- Ex : SELECT id FROM projects WHERE name = 'Mon projet';
-- ─────────────────────────────────────────────────────────────────────────


-- ══════════════════════════════════════════════════════════════════════════
-- TEMPLATE 1 — E-COMMERCE SHOPIFY
-- Pour les boutiques en ligne, sites marchands, dropshipping
-- ══════════════════════════════════════════════════════════════════════════

/*
INSERT INTO onboarding_forms (project_id, title, fields) VALUES (
  ':project_id',
  'Formulaire de démarrage — E-commerce Shopify',
  '[
    {
      "id": "f1_nom_boutique",
      "type": "text",
      "label": "Nom de votre boutique",
      "placeholder": "Ex : La Maison du Lin",
      "required": true
    },
    {
      "id": "f1_secteur",
      "type": "select",
      "label": "Secteur d''activité",
      "required": true,
      "options": ["Mode & Vêtements", "Maison & Décoration", "Alimentation & Épicerie fine", "Beauté & Cosmétiques", "Sport & Outdoor", "Bijoux & Accessoires", "Enfant & Puériculture", "High-tech & Électronique", "Autre"]
    },
    {
      "id": "f1_produits",
      "type": "textarea",
      "label": "Décrivez vos produits principaux",
      "placeholder": "Ex : Linge de maison haut de gamme — draps, housses de couette, serviettes. Fabrication française, gamme de 20 à 200€.",
      "required": true
    },
    {
      "id": "f1_nb_produits",
      "type": "select",
      "label": "Nombre de produits à mettre en ligne",
      "required": true,
      "options": ["Moins de 20 produits", "20 à 50 produits", "50 à 100 produits", "Plus de 100 produits"]
    },
    {
      "id": "f1_cible",
      "type": "textarea",
      "label": "Qui sont vos clients cibles ?",
      "placeholder": "Ex : Femmes 35-55 ans, CSP+, sensibles à la qualité et à l''éco-responsabilité.",
      "required": true
    },
    {
      "id": "f1_concurrents",
      "type": "textarea",
      "label": "Citez 2-3 sites concurrents ou sources d''inspiration",
      "placeholder": "Ex : lemonde.fr/boutique, alexandretogni.com, ...",
      "required": false
    },
    {
      "id": "f1_couleurs",
      "type": "multiselect",
      "label": "Ambiance visuelle souhaitée",
      "required": false,
      "options": ["Épuré & minimaliste", "Coloré & joyeux", "Luxe & premium", "Naturel & organique", "Moderne & tech", "Vintage & artisanal"]
    },
    {
      "id": "f1_logo",
      "type": "url",
      "label": "Lien vers votre logo (Google Drive, Dropbox...)",
      "placeholder": "https://drive.google.com/...",
      "required": false
    },
    {
      "id": "f1_domaine",
      "type": "text",
      "label": "Nom de domaine souhaité ou existant",
      "placeholder": "Ex : mamaisondelin.fr",
      "required": false
    },
    {
      "id": "f1_livraison",
      "type": "multiselect",
      "label": "Modes de livraison prévus",
      "required": false,
      "options": ["Colissimo", "Mondial Relay", "DHL / Chronopost", "Click & Collect", "Livraison internationale", "Je ne sais pas encore"]
    },
    {
      "id": "f1_infos_supp",
      "type": "textarea",
      "label": "Informations supplémentaires",
      "placeholder": "Tout ce que vous jugez utile de nous communiquer pour démarrer.",
      "required": false
    }
  ]'::jsonb
);
*/


-- ══════════════════════════════════════════════════════════════════════════
-- TEMPLATE 2 — SITE VITRINE / PORTFOLIO
-- Pour artisans, prestataires, PME, professions libérales, agences
-- ══════════════════════════════════════════════════════════════════════════

/*
INSERT INTO onboarding_forms (project_id, title, fields) VALUES (
  ':project_id',
  'Formulaire de démarrage — Site vitrine',
  '[
    {
      "id": "f2_nom_entreprise",
      "type": "text",
      "label": "Nom de votre entreprise ou activité",
      "placeholder": "Ex : Cabinet Martin & Associés",
      "required": true
    },
    {
      "id": "f2_activite",
      "type": "textarea",
      "label": "Décrivez votre activité en 3-4 phrases",
      "placeholder": "Ex : Cabinet d''expertise comptable basé à Lyon, spécialisé dans l''accompagnement des TPE/PME. Fondé en 2008, 3 associés, 12 collaborateurs.",
      "required": true
    },
    {
      "id": "f2_objectif",
      "type": "multiselect",
      "label": "Objectifs principaux du site",
      "required": true,
      "options": ["Présenter mon activité / portfolio", "Générer des demandes de contact", "Référencer mon activité localement", "Remplacer un site vieillissant", "Asseoir ma crédibilité professionnelle", "Attirer des collaborateurs / recrutement"]
    },
    {
      "id": "f2_pages",
      "type": "multiselect",
      "label": "Pages souhaitées",
      "required": true,
      "options": ["Accueil", "À propos / Notre équipe", "Services / Prestations", "Réalisations / Portfolio", "Témoignages / Avis", "Blog / Actualités", "Contact", "Mentions légales / CGV", "FAQ"]
    },
    {
      "id": "f2_cible",
      "type": "textarea",
      "label": "Qui sont vos clients / visiteurs cibles ?",
      "placeholder": "Ex : Dirigeants de TPE/PME en région lyonnaise, cherchant un comptable de confiance.",
      "required": true
    },
    {
      "id": "f2_concurrent",
      "type": "textarea",
      "label": "Sites de référence ou concurrents (liens)",
      "placeholder": "Ex : https://cabinet-dupont.fr, https://www.deloitte.fr ...",
      "required": false
    },
    {
      "id": "f2_ambiance",
      "type": "multiselect",
      "label": "Ambiance visuelle souhaitée",
      "required": false,
      "options": ["Professionnel & sobre", "Chaleureux & humain", "Moderne & épuré", "Coloré & dynamique", "Premium & luxueux", "Artisanal & authentique"]
    },
    {
      "id": "f2_logo",
      "type": "url",
      "label": "Lien vers votre logo et charte graphique (si existants)",
      "placeholder": "https://drive.google.com/...",
      "required": false
    },
    {
      "id": "f2_textes",
      "type": "select",
      "label": "Les textes du site",
      "required": true,
      "options": ["Je fournis tous les textes", "Je fournis une base, vivesmedia.com les améliore", "vivesmedia.com rédige tout le contenu"]
    },
    {
      "id": "f2_photos",
      "type": "select",
      "label": "Les photos / visuels",
      "required": true,
      "options": ["J''ai mes propres photos professionnelles", "Mélange photos personnelles + banque d''images", "Uniquement banque d''images (Unsplash, etc.)", "Shooting photo à prévoir"]
    },
    {
      "id": "f2_domaine",
      "type": "text",
      "label": "Nom de domaine souhaité ou existant",
      "placeholder": "Ex : cabinet-martin-lyon.fr",
      "required": false
    },
    {
      "id": "f2_infos",
      "type": "textarea",
      "label": "Informations supplémentaires",
      "placeholder": "Contraintes techniques, délais souhaités, budget indicatif...",
      "required": false
    }
  ]'::jsonb
);
*/


-- ══════════════════════════════════════════════════════════════════════════
-- TEMPLATE 3 — REFONTE D'UN SITE EXISTANT
-- Pour les projets de refonte complète ou partielle
-- ══════════════════════════════════════════════════════════════════════════

/*
INSERT INTO onboarding_forms (project_id, title, fields) VALUES (
  ':project_id',
  'Formulaire de démarrage — Refonte de site',
  '[
    {
      "id": "f3_url_actuel",
      "type": "url",
      "label": "URL de votre site actuel",
      "placeholder": "https://monsite.fr",
      "required": true
    },
    {
      "id": "f3_problemes",
      "type": "multiselect",
      "label": "Pourquoi souhaitez-vous refondre votre site ?",
      "required": true,
      "options": ["Design vieillissant / pas professionnel", "Site pas responsive / mauvais sur mobile", "Mauvais référencement Google", "Difficile à mettre à jour", "Trop lent", "Mauvaise conversion (peu de contacts / ventes)", "Changement d''activité ou de positionnement", "Changement de nom ou d''identité visuelle"]
    },
    {
      "id": "f3_conserver",
      "type": "multiselect",
      "label": "Qu''est-ce que vous souhaitez conserver ?",
      "required": false,
      "options": ["Certains textes existants", "Le nom de domaine", "Le logo actuel", "Certaines pages (blog, réalisations...)", "Les photos actuelles", "Rien — tout recommencer"]
    },
    {
      "id": "f3_ameliorer",
      "type": "textarea",
      "label": "Qu''attendez-vous du nouveau site que l''actuel ne fait pas ?",
      "placeholder": "Ex : Générer plus de contacts, avoir un design moderne qui inspire confiance, être bien positionné sur Google...",
      "required": true
    },
    {
      "id": "f3_inspiration",
      "type": "textarea",
      "label": "Sites de référence pour le nouveau design (liens)",
      "placeholder": "3 à 5 sites que vous aimez visuellement ou fonctionnellement.",
      "required": false
    },
    {
      "id": "f3_acces",
      "type": "select",
      "label": "Avez-vous accès à votre hébergement/domaine actuel ?",
      "required": true,
      "options": ["Oui, j''ai tous les accès", "Partiellement (domaine oui, hébergeur non)", "Non, je dois récupérer les accès", "Je ne sais pas"]
    },
    {
      "id": "f3_cms_actuel",
      "type": "select",
      "label": "Quel est le CMS / technologie du site actuel ?",
      "required": false,
      "options": ["WordPress", "Shopify", "Wix", "Squarespace", "Prestashop", "Site codé sur mesure", "Je ne sais pas"]
    },
    {
      "id": "f3_redirections",
      "type": "select",
      "label": "Le site actuel est-il bien référencé sur Google ?",
      "required": false,
      "options": ["Oui — il faut gérer les redirections avec soin", "Moyennement référencé", "Non — peu de trafic organique", "Je ne sais pas"]
    },
    {
      "id": "f3_logo",
      "type": "url",
      "label": "Lien vers votre nouveau logo / charte (si refonte de marque)",
      "placeholder": "https://drive.google.com/...",
      "required": false
    },
    {
      "id": "f3_delai",
      "type": "select",
      "label": "Délai souhaité pour la mise en ligne",
      "required": false,
      "options": ["Le plus tôt possible (< 4 semaines)", "Dans 1 à 2 mois", "Dans 2 à 3 mois", "Pas de contrainte particulière"]
    },
    {
      "id": "f3_budget",
      "type": "select",
      "label": "Budget indicatif pour ce projet",
      "required": false,
      "options": ["Moins de 2 000 €", "2 000 — 4 000 €", "4 000 — 8 000 €", "Plus de 8 000 €", "Je préfère ne pas l''indiquer"]
    },
    {
      "id": "f3_infos",
      "type": "textarea",
      "label": "Informations supplémentaires",
      "placeholder": "Tout ce qui peut nous aider à bien comprendre votre projet de refonte.",
      "required": false
    }
  ]'::jsonb
);
*/


-- ─────────────────────────────────────────────────────────────────────────
-- INSTRUCTIONS D'UTILISATION
-- ─────────────────────────────────────────────────────────────────────────
--
-- 1. Ouvrir Supabase > SQL Editor
-- 2. Trouver l'UUID du projet cible :
--    SELECT id, name FROM projects ORDER BY created_at DESC LIMIT 10;
--
-- 3. Copier le bloc INSERT du template souhaité (enlever /* et */)
-- 4. Remplacer ':project_id' par le vrai UUID
-- 5. Exécuter
--
-- Vérification :
--    SELECT id, title, jsonb_array_length(fields) as nb_champs
--    FROM onboarding_forms ORDER BY created_at DESC LIMIT 5;
-- ─────────────────────────────────────────────────────────────────────────
