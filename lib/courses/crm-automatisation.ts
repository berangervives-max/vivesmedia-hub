import type { Course } from './types'

export const crmAutomatisation: Course = {
  slug: 'crm-automatisation',
  title: 'CRM & Automatisation IA',
  tagline: 'Vos tâches répétitives gérées toutes seules — pendant que vous vendez.',
  level: 'Intermédiaire',
  durationLabel: '≈ 1h de contenu',
  audience: 'TPE/PME qui perdent du temps en tâches manuelles (relances, devis, onboarding)',
  coverImageUrl: '/courses/crm-automatisation/cover.webp',
  outcomes: [
    'Identifier les tâches à automatiser en priorité (ROI)',
    'Comprendre ce qu\'est un workflow et un agent IA',
    'Comprendre votre CRM et le scoring des leads',
    'Lire votre tableau de bord KPIs',
    'Maintenir et faire évoluer vos automatisations',
  ],
  deliverables: [
    'Agents IA 24/7', 'Séquences de prospection (J+3, J+7, J+14)', 'CRM intelligent + scoring',
    'Workflows n8n sur-mesure', 'Devis automatisés', 'Tableau de bord KPIs', 'Formation + 1 mois de suivi',
  ],
  modules: [
    {
      id: 'cr-m0', title: 'Bienvenue', summary: 'Automatiser pour récupérer du temps.',
      lessons: [{
        id: 'cr-l0', title: 'Pourquoi automatiser', durationMin: 6,
        imageUrl: '/courses/crm-automatisation/cover.webp', imageAlt: 'Automatisation et CRM', videoUrl: null,
        videoScript: 'Montrer un schéma : formulaire → CRM → email auto → relances → RDV. « Ça tourne même quand vous dormez. »',
        body: `**En résumé :** on confie à des **workflows** et des **agents IA** vos tâches répétitives (relances, devis, onboarding) pour vous libérer du temps — et ne plus jamais oublier un lead.

## Ce qui est inclus
- **Agents IA 24/7** (qualifient, répondent, envoient des devis).
- **Séquences de prospection** (relances J+3/J+7/J+14).
- **CRM** avec **scoring** (chaud/tiède/froid) + alertes.
- **Workflows n8n** connectés à vos outils (Gmail, Calendly, Notion, Shopify, Stripe…).
- **Tableau de bord KPIs** + formation + 1 mois de suivi.

> On commence toujours par un **audit des processus** pour viser le meilleur ROI.`,
      }],
    },
    {
      id: 'cr-m1', title: 'Module 1 — Quoi automatiser en premier', summary: 'Repérer les tâches à fort ROI.',
      lessons: [{
        id: 'cr-l1', title: 'Identifier les bons candidats', durationMin: 13,
        imageUrl: '/courses/crm-automatisation/m1.webp', imageAlt: 'Cartographie des tâches', videoUrl: null,
        videoScript: 'Matrice fréquence × temps : automatiser ce qui est fréquent ET chronophage en premier.',
        body: `**En résumé :** on automatise d'abord ce qui est **fréquent ET chronophage**.

## La règle du ROI
- **Fréquent + long** → automatiser en priorité (relances, saisie, confirmations).
- **Rare + complexe** → souvent à garder en manuel (le sur-automatiser coûte plus que ça ne rapporte).

## Bons candidats typiques
- Relances de devis / prospects.
- Confirmation de RDV + rappels SMS/email.
- Onboarding client (accueil, documents).
- Saisie/copie de données entre outils.

## À retenir
- Visez le **temps récupéré**, pas la prouesse technique.
- 3 automatisations bien choisies changent déjà la vie.`,
      }],
      quiz: {
        id: 'cr-q1', title: 'Quiz — Priorités', passScore: 50,
        questions: [
          { id: 'cr-q1a', question: 'Quelle tâche automatiser en priorité ?', options: ['Une tâche rare et complexe', 'Une tâche fréquente et chronophage', 'Aucune'], correctIndex: 1, explanation: 'Le ROI vient des tâches fréquentes et longues. Le rare/complexe reste souvent manuel.' },
        ],
      },
    },
    {
      id: 'cr-m2', title: 'Module 2 — Workflows, agents & CRM', summary: 'Comprendre ce qui tourne sous le capot.',
      lessons: [{
        id: 'cr-l2', title: 'Workflow, agent IA et scoring', durationMin: 14,
        imageUrl: '/courses/crm-automatisation/m2.webp', imageAlt: 'Workflows et agents IA', videoUrl: null,
        videoScript: 'Montrer un workflow n8n simple (déclencheur → conditions → actions) et une fiche CRM avec score.',
        body: `**En résumé :** pas besoin d'être technique — voici les concepts.

## Les briques
- **Workflow** : un enchaînement « si ceci → fais cela » (déclencheur → conditions → actions). Construit dans **n8n**.
- **Agent IA** : une « personne virtuelle » qui lit une demande, comprend et répond/agit (qualifier un lead, rédiger un devis).
- **CRM** : votre base de contacts, avec un **score** automatique (chaud/tiède/froid) et des **alertes** quand un prospect interagit.

## Sécurité
- Vos **identifiants** ne sont jamais stockés en clair dans les workflows.

## À retenir
- Workflow = automatisme à règles ; Agent IA = intelligence qui décide.
- Le scoring vous fait **prioriser** les bons prospects.`,
      }],
      quiz: {
        id: 'cr-q2', title: 'Quiz — Concepts', passScore: 50,
        questions: [
          { id: 'cr-q2a', question: 'Un « workflow », c\'est…', options: ['Un enchaînement déclencheur → conditions → actions', 'Un type de facture', 'Une page web'], correctIndex: 0, explanation: 'C\'est un automatisme à règles (souvent construit dans n8n).' },
          { id: 'cr-q2b', question: 'À quoi sert le scoring des leads ?', options: ['À les classer chaud/tiède/froid pour prioriser', 'À les supprimer', 'À rien'], correctIndex: 0, explanation: 'Le score vous dit où concentrer vos efforts commerciaux.' },
        ],
      },
    },
    {
      id: 'cr-m3', title: 'Module 3 — Piloter & faire évoluer', summary: 'Lire les KPIs et entretenir le système.',
      lessons: [{
        id: 'cr-l3', title: 'Tableau de bord & évolutions', durationMin: 11,
        imageUrl: '/courses/crm-automatisation/m3.webp', imageAlt: 'Tableau de bord KPIs', videoUrl: null,
        videoScript: 'Montrer un dashboard : CA, leads, taux de conversion, temps de réponse moyen.',
        body: `**En résumé :** une fois en place, vous **pilotez** et le système **évolue** avec vous.

## Lire le tableau de bord
- **CA**, **leads**, **taux de conversion**, **temps de réponse moyen** — en temps réel.
- Repérez les goulots : où ça bloque dans le parcours ?

## Faire évoluer
- Vos besoins changent → on ajuste/ajoute des automatisations.
- **Formation + documentation** des workflows fournies ; 1 mois de suivi inclus.

## À retenir
- Une automatisation se **surveille** (qu'elle tourne bien) et s'**améliore**.
- Le bon réflexe : « quelle tâche me prend encore trop de temps ? »`,
      }],
    },
  ],
}
