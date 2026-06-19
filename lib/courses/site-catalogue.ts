import type { Course } from './types'

export const siteCatalogue: Course = {
  slug: 'site-catalogue',
  title: 'Site Catalogue',
  tagline: 'Présentez vos produits professionnellement — et exploitez-les en rendez-vous.',
  level: 'Débutant',
  durationLabel: '≈ 1h de contenu',
  audience: 'Grossistes, fabricants, artisans avec gamme produit, B2B sans vente en ligne',
  coverImageUrl: '/courses/site-catalogue/cover.webp',
  outcomes: [
    'Comprendre la différence catalogue vs e-commerce',
    'Structurer vos catégories et filtres pour que le client trouve vite',
    'Gérer vos fiches produits et fiches techniques PDF',
    'Recevoir et traiter les demandes de devis',
    'Utiliser votre catalogue comme outil commercial',
  ],
  deliverables: [
    'Jusqu\'à 250 fiches produits', 'Filtres de recherche avancés', 'Fiches techniques PDF',
    'Formulaire de devis par produit', 'Import CSV', '45 min de formation',
  ],
  modules: [
    {
      id: 'sc-m0', title: 'Bienvenue', summary: 'Catalogue ou e-commerce : la bonne brique.',
      lessons: [{
        id: 'sc-l0', title: 'À quoi sert un site catalogue', durationMin: 6,
        imageUrl: '/courses/site-catalogue/cover.webp', imageAlt: 'Site catalogue produits', videoUrl: null,
        videoScript: 'Montrer une fiche produit avec bouton « Demander un devis » et un PDF téléchargeable.',
        body: `**En résumé :** un site catalogue **présente** vos produits (photos, caractéristiques, prix ou « sur devis ») **sans paiement en ligne**. Idéal en B2B et pour les ventes en rendez-vous.

## Catalogue vs e-commerce
- **Catalogue** : on présente, le client **demande un devis** ou vient au showroom.
- **E-commerce** : on présente **et on encaisse** en ligne (panier, paiement).

## Ce qui est inclus
- Jusqu'à **250 fiches produits**, **filtres** avancés, **fiches techniques PDF**, **devis par produit**, **import CSV**, responsive.

> Délai indicatif : ~2 semaines.`,
      }],
    },
    {
      id: 'sc-m1', title: 'Module 1 — Structurer le catalogue', summary: 'Catégories et filtres : trouver en 2 clics.',
      lessons: [{
        id: 'sc-l1', title: 'Catégories, filtres et navigation', durationMin: 14,
        imageUrl: '/courses/site-catalogue/m1.webp', imageAlt: 'Filtres et catégories', videoUrl: null,
        videoScript: 'Montrer des filtres (matière, dimension, couleur, prix) qui réduisent une liste de 180 produits à 3.',
        body: `**En résumé :** la valeur d'un catalogue, c'est que le client **trouve vite**.

## Bien penser sa structure
- **Catégories** logiques (comme un client raisonne, pas comme votre ERP).
- **Filtres** utiles : matière, dimension, couleur, prix, usage…
- **Recherche** claire + fil d'Ariane pour ne jamais se perdre.

## Conseils
- Ne multipliez pas les catégories : 5-8 grandes familles valent mieux que 40.
- Chaque fiche = des **caractéristiques homogènes** (mêmes champs partout) → filtres efficaces.

## À retenir
- Pensez **parcours client**, pas organisation interne.
- Des filtres pertinents = moins d'abandons.`,
      }],
      quiz: {
        id: 'sc-q1', title: 'Quiz — Structure', passScore: 50,
        questions: [
          { id: 'sc-q1a', question: 'Comment organiser ses catégories ?', options: ['Comme votre logiciel interne', 'Comme un client raisonne quand il cherche', 'Par ordre alphabétique strict'], correctIndex: 1, explanation: 'On structure selon la logique du client, pas selon vos contraintes internes.' },
        ],
      },
    },
    {
      id: 'sc-m2', title: 'Module 2 — Fiches produits & PDF', summary: 'Des fiches qui convainquent et servent en RDV.',
      lessons: [{
        id: 'sc-l2', title: 'Rédiger une fiche + fiches techniques', durationMin: 12,
        imageUrl: '/courses/site-catalogue/m2.webp', imageAlt: 'Fiche produit', videoUrl: null,
        videoScript: 'Montrer une fiche complète : photo nette, caractéristiques, bénéfice client, bouton devis, PDF.',
        body: `**En résumé :** une bonne fiche **informe** et **rassure**.

## Une fiche qui marche
- **Photo nette** (plusieurs angles si possible).
- **Caractéristiques techniques** complètes et homogènes.
- Un **bénéfice client** en 1 phrase (pas que des specs).
- **Fiche technique PDF** téléchargeable — parfaite en rendez-vous B2B.
- Prix ou **« Sur devis »** + bouton **Demander un devis**.

## À retenir
- Specs + bénéfice : les deux comptent.
- Le **PDF** transforme votre site en outil commercial hors-ligne.`,
      }],
    },
    {
      id: 'sc-m3', title: 'Module 3 — Devis & gestion', summary: 'Recevoir les demandes et tenir le catalogue à jour.',
      lessons: [{
        id: 'sc-l3', title: 'Demandes de devis + import CSV', durationMin: 12,
        imageUrl: '/courses/site-catalogue/m3.webp', imageAlt: 'Demandes de devis', videoUrl: null,
        videoScript: 'Montrer l\'arrivée d\'une demande de devis par email + un import CSV de produits.',
        body: `**En résumé :** chaque fiche peut générer une **demande de devis**, et vous gérez la gamme vous-même.

## Les devis
- Bouton **« Demander un devis »** sur chaque produit → notification **email instantanée**.
- Répondez vite : un devis rapide gagne souvent l'affaire.

## Gérer la gamme
- Ajout/modif manuelle, ou **import CSV** pour les grandes gammes (+100 réf.).
- 45 min de **formation** pour être autonome.

## À retenir
- Réactivité sur les devis = taux de transformation.
- Le CSV vous évite la saisie une à une.`,
      }],
      quiz: {
        id: 'sc-q3', title: 'Quiz — Devis & gestion', passScore: 50,
        questions: [
          { id: 'sc-q3a', question: 'Que se passe-t-il quand un client demande un devis ?', options: ['Rien', 'Vous recevez une notification email instantanée', 'Le produit est vendu automatiquement'], correctIndex: 1, explanation: 'Un site catalogue ne vend pas en ligne : il génère des demandes de devis qualifiées.' },
        ],
      },
    },
  ],
}
