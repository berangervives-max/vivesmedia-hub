import type { Course } from './types'

export const siteEcommerce: Course = {
  slug: 'site-ecommerce',
  title: 'Site E-Commerce',
  tagline: 'Votre boutique prête à vendre — et comment la piloter au quotidien.',
  level: 'Débutant → Intermédiaire',
  durationLabel: '≈ 1h30 de contenu',
  audience: 'Commerçants, marques, producteurs qui veulent vendre en ligne',
  coverImageUrl: '/courses/site-ecommerce/cover.webp',
  outcomes: [
    'Comprendre les briques d\'une boutique qui convertit',
    'Gérer produits, stocks et commandes depuis l\'admin',
    'Comprendre le tunnel de commande et les paiements (Stripe/PayPal)',
    'Réduire les paniers abandonnés et fidéliser',
    'Lire vos premiers indicateurs de vente',
  ],
  deliverables: [
    'Boutique jusqu\'à 50 produits', 'Paiement Stripe & PayPal', 'Gestion stocks temps réel',
    'Emails transactionnels', 'Blog SEO intégré', 'RGPD e-commerce', '2h de formation', 'Support 6 mois',
  ],
  modules: [
    {
      id: 'se-m0', title: 'Bienvenue', summary: 'Les briques de votre boutique.',
      lessons: [{
        id: 'se-l0', title: 'Votre boutique, vue d\'ensemble', durationMin: 7,
        imageUrl: '/courses/site-ecommerce/cover.webp', imageAlt: 'Boutique e-commerce', videoUrl: null,
        videoScript: 'Tour rapide d\'une boutique : catalogue → fiche → panier → checkout → email de confirmation.',
        body: `**En résumé :** une boutique en ligne, c'est un **parcours** : le client découvre, ajoute au panier, paie, reçoit ses emails. Chaque maillon compte.

## Les briques incluses
- **Catalogue** jusqu'à 50 produits (import CSV possible).
- **Paiement Stripe & PayPal** (frais Stripe : 1,4% + 0,25€/transaction).
- **Stocks temps réel**, **dashboard admin**, **emails transactionnels**.
- **Blog SEO**, **conformité RGPD** e-commerce, **support 6 mois**.

> Délai indicatif : ~3 semaines. Formation admin de **2h** incluse à la livraison.`,
      }],
    },
    {
      id: 'se-m1', title: 'Module 1 — Gérer la boutique', summary: 'Produits, stocks, commandes au quotidien.',
      lessons: [{
        id: 'se-l1', title: 'Produits, stocks & commandes', durationMin: 16,
        imageUrl: '/courses/site-ecommerce/m1.webp', imageAlt: 'Dashboard admin e-commerce', videoUrl: null,
        videoScript: 'Démo admin : créer un produit, ajuster un stock, traiter une commande (statut, expédition).',
        body: `**En résumé :** l'admin vous laisse tout gérer **sans toucher au code**.

## Au quotidien
- **Produits** : titre, photos, prix, variantes, description (soignez le SEO).
- **Stocks** temps réel : mis à jour à chaque vente, alertes possibles → fini la rupture vendue.
- **Commandes** : suivez le statut (payée, préparée, expédiée), envoyez le suivi.

## Bonnes pratiques
- Photos nettes + descriptions qui **lèvent les doutes** (taille, matière, délais).
- Tenez les **stocks à jour** : rien n'énerve plus qu'une commande annulée pour rupture.

## À retenir
- Vous (ou votre équipe) gérez tout depuis le dashboard.
- Fiche produit claire = moins de SAV, plus de ventes.`,
      }],
      quiz: {
        id: 'se-q1', title: 'Quiz — Gestion', passScore: 50,
        questions: [
          { id: 'se-q1a', question: 'Que se passe-t-il pour le stock à chaque vente ?', options: ['Rien, à faire à la main', 'Il se met à jour automatiquement en temps réel', 'Il augmente'], correctIndex: 1, explanation: 'Le stock temps réel évite de vendre un produit en rupture.' },
        ],
      },
    },
    {
      id: 'se-m2', title: 'Module 2 — Tunnel & paiements', summary: 'Comprendre le checkout et encaisser sereinement.',
      lessons: [{
        id: 'se-l2', title: 'Tunnel de commande & paiement', durationMin: 14,
        imageUrl: '/courses/site-ecommerce/m2.webp', imageAlt: 'Tunnel de paiement', videoUrl: null,
        videoScript: 'Montrer panier → checkout → paiement Stripe. Expliquer où se règlent les frais de livraison par zone.',
        body: `**En résumé :** le **tunnel** (panier → checkout → paiement) est l'endroit où l'argent rentre… ou se perd.

## Les essentiels
- **Stripe & PayPal** : les 2 modes préférés des acheteurs français, sécurisés.
- **Frais de livraison** configurables par zone.
- Checkout **court et clair** : chaque champ en trop fait fuir.

## Réduire l'abandon de panier
- Frais de port **affichés tôt** (la surprise au checkout = abandon n°1).
- **Email de relance** panier abandonné (inclus).
- Confiance : avis, SSL visible, politique de retour claire.

## À retenir
- Un tunnel simple = plus de ventes.
- La relance panier récupère du CA « gratuit ».`,
      }],
      quiz: {
        id: 'se-q2', title: 'Quiz — Tunnel', passScore: 50,
        questions: [
          { id: 'se-q2a', question: 'Cause n°1 d\'abandon de panier ?', options: ['Trop de photos', 'Frais de livraison découverts trop tard', 'Un site trop rapide'], correctIndex: 1, explanation: 'Afficher les frais tôt évite la mauvaise surprise au paiement.' },
          { id: 'se-q2b', question: 'À quoi sert l\'email de relance panier ?', options: ['À spammer', 'À récupérer des ventes abandonnées', 'À rien'], correctIndex: 1, explanation: 'La relance ramène une partie des paniers abandonnés — du CA récupéré.' },
        ],
      },
    },
    {
      id: 'se-m3', title: 'Module 3 — Vendre plus & mesurer', summary: 'Trafic, fidélisation et indicateurs.',
      lessons: [{
        id: 'se-l3', title: 'Attirer, fidéliser, mesurer', durationMin: 14,
        imageUrl: '/courses/site-ecommerce/m3.webp', imageAlt: 'Croissance des ventes', videoUrl: null,
        videoScript: 'Montrer le blog SEO intégré + un mini tableau de bord ventes (CA, panier moyen, taux de conversion).',
        body: `**En résumé :** une boutique vit de **trafic** + **conversion** + **fidélisation**.

## Attirer
- **Blog SEO intégré** : des articles qui captent du trafic qualifié (voir le service SEO).
- Réseaux sociaux, Google Shopping (en option).

## Fidéliser
- Emails post-achat, codes promo, retours simples = clients qui reviennent.

## Mesurer
- **Taux de conversion**, **panier moyen**, **produits stars**.
- Décidez avec les chiffres, pas au feeling.

## À retenir
- Acquérir un client coûte cher : **fidéliser** est le levier le plus rentable.
- Suivez 3 chiffres : CA, conversion, panier moyen.`,
      }],
    },
  ],
}
