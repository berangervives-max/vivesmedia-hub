import type { Course } from './types'

export const maintenance: Course = {
  slug: 'maintenance',
  title: 'Maintenance',
  tagline: 'Votre site protégé, à jour et toujours en ligne — l\'esprit tranquille.',
  level: 'Débutant',
  durationLabel: '≈ 45 min de contenu',
  audience: 'Tout propriétaire de site (créé par nous ou non) qui veut dormir tranquille',
  coverImageUrl: '/courses/maintenance/cover.webp',
  outcomes: [
    'Comprendre pourquoi un site doit être maintenu',
    'Connaître ce qui est surveillé et sauvegardé',
    'Savoir comment demander une modification',
    'Comprendre les 3 formules et choisir la bonne',
    'Lire votre rapport mensuel de maintenance',
  ],
  deliverables: [
    'Mises à jour sécurité', 'Sauvegardes régulières', 'Monitoring 24/7', 'Vérification SSL',
    'Heures de modifications incluses', 'Rapport mensuel', 'Sites tiers acceptés',
  ],
  modules: [
    {
      id: 'mt-m0', title: 'Bienvenue', summary: 'Pourquoi un site se maintient.',
      lessons: [{
        id: 'mt-l0', title: 'Un site n\'est jamais « fini »', durationMin: 6,
        imageUrl: '/courses/maintenance/cover.webp', imageAlt: 'Maintenance et sécurité du site', videoUrl: null,
        videoScript: 'Analogie voiture : un site aussi a besoin d\'entretien (sécurité, sauvegardes) sinon panne un jour.',
        body: `**En résumé :** un site, comme une voiture, a besoin d'**entretien**. Sans maintenance, on s'expose aux failles de sécurité, aux pannes et à la perte de données.

## Ce que couvre la maintenance
- **Mises à jour sécurité** (patches sous 48h).
- **Sauvegardes** régulières (restauration possible).
- **Monitoring 24/7** (alerte si le site tombe).
- **Vérification SSL** (jamais de « site non sécurisé »).
- **Heures de modifications** + **rapport mensuel**.

> Site fait sur WordPress, Shopify ou Webflow ? **Sites tiers acceptés**, diagnostic initial offert.`,
      }],
    },
    {
      id: 'mt-m1', title: 'Module 1 — Ce qui est protégé', summary: 'Sécurité, sauvegardes, disponibilité.',
      lessons: [{
        id: 'mt-l1', title: 'Sécurité, sauvegardes & monitoring', durationMin: 12,
        imageUrl: '/courses/maintenance/m1.webp', imageAlt: 'Sécurité et sauvegardes', videoUrl: null,
        videoScript: 'Montrer une alerte uptime + une restauration de sauvegarde. Rassurer sur la réactivité.',
        body: `**En résumé :** on veille pour que votre site reste **sûr, sauvegardé et en ligne**.

## Les protections
- **Sécurité** : patches appliqués sous 48h → protégé contre les failles connues.
- **Sauvegardes** : quotidiennes/hebdo/mensuelles selon la formule → on peut **restaurer** en cas de pépin.
- **Monitoring 24/7** : alerte immédiate si le site tombe (même à 3h du matin) → intervention prioritaire.
- **SSL** surveillé : HTTPS toujours valide.

## À retenir
- La sécurité est **continue**, pas une action ponctuelle.
- Une bonne sauvegarde = votre filet de sécurité absolu.`,
      }],
      quiz: {
        id: 'mt-q1', title: 'Quiz — Protection', passScore: 50,
        questions: [
          { id: 'mt-q1a', question: 'À quoi sert une sauvegarde ?', options: ['À rien', 'À pouvoir restaurer le site en cas de problème', 'À ralentir le site'], correctIndex: 1, explanation: 'La sauvegarde est le filet de sécurité : on restaure une version saine si besoin.' },
          { id: 'mt-q1b', question: 'Le monitoring 24/7 permet…', options: ['D\'être alerté immédiatement si le site tombe', 'De créer des produits', 'De changer le logo'], correctIndex: 0, explanation: 'Il détecte une panne en continu pour intervenir au plus vite.' },
        ],
      },
    },
    {
      id: 'mt-m2', title: 'Module 2 — Demander une modif & formules', summary: 'Utiliser vos heures et choisir le bon plan.',
      lessons: [{
        id: 'mt-l2', title: 'Modifications, formules & rapport', durationMin: 13,
        imageUrl: '/courses/maintenance/m2.webp', imageAlt: 'Demande de modification', videoUrl: null,
        videoScript: 'Montrer comment envoyer une demande (ticket) et les 3 formules côte à côte.',
        body: `**En résumé :** vous envoyez vos demandes, on les intègre dans vos **heures incluses**.

## Demander une modif
- Un **ticket** (texte, image, page, promo) → traité selon la priorité de votre formule.
- Réponse sous **48h (Essentiel)**, **24h (Pro)** ou **visio dédiée (Premium)**.

## Les 3 formules
| Formule | Prix | Inclus |
|---------|------|--------|
| **Essentiel** | 55€/mois | MAJ sécurité, sauvegarde mensuelle, 1h modif/mois, support 48h |
| **Pro** ⭐ | 110€/mois | Sauvegarde hebdo, 3h modif/mois, support 24h, monitoring 24/7 |
| **Premium** | 165€/mois | Sauvegarde quotidienne, 5h modif/mois, support visio, audit sécurité mensuel |

## À retenir
- Choisissez selon votre **fréquence de modifs** et le **niveau de réactivité** voulu.
- Le **rapport mensuel** récapitule uptime, perfs et actions réalisées.`,
      }],
      quiz: {
        id: 'mt-q2', title: 'Quiz — Formules', passScore: 50,
        questions: [
          { id: 'mt-q2a', question: 'Comment demander une modification ?', options: ['Impossible', 'Via un ticket, intégré dans vos heures incluses', 'En recréant le site'], correctIndex: 1, explanation: 'Vous envoyez la demande, elle est traitée dans vos heures mensuelles incluses.' },
          { id: 'mt-q2b', question: 'La formule Pro inclut combien d\'heures de modif/mois ?', options: ['1h', '3h', '10h'], correctIndex: 1, explanation: 'Pro = 3h de modifications/mois + support 24h + monitoring.' },
        ],
      },
    },
  ],
}
