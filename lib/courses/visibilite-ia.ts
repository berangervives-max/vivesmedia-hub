import type { Course } from './types'

export const visibiliteIa: Course = {
  slug: 'visibilite-ia',
  title: 'Visibilité IA (AEO/GEO)',
  tagline: 'Être cité par ChatGPT, Perplexity, Gemini & les AI Overviews de Google.',
  level: 'Intermédiaire',
  durationLabel: '≈ 1h de contenu',
  audience: 'Entreprises qui veulent exister dans les réponses des IA, pas seulement sur Google',
  coverImageUrl: '/courses/visibilite-ia/cover.webp',
  outcomes: [
    'Comprendre AEO et GEO et leur différence avec le SEO',
    'Savoir pourquoi les IA citent (ou évitent) une marque',
    'Comprendre l\'audit de citations et le suivi mensuel',
    'Optimiser une page pour être une source des réponses IA',
    'Lire le Brand Radar et les alertes de mentions',
  ],
  deliverables: [
    'Audit citations IA (50+ requêtes)', 'Tracking mensuel', 'Optimisation contenu AEO',
    'Rapport Brand Radar', 'Schema.org implémenté', 'Alertes mentions IA',
  ],
  modules: [
    {
      id: 'vi-m0', title: 'Bienvenue', summary: 'Le nouveau terrain de jeu : les moteurs IA.',
      lessons: [{
        id: 'vi-l0', title: 'Pourquoi la visibilité IA compte', durationMin: 7,
        imageUrl: '/courses/visibilite-ia/cover.webp', imageAlt: 'Visibilité dans les IA', videoUrl: null,
        videoScript: 'Poser une question dans ChatGPT/Perplexity et montrer les sources citées : « le but, c\'est d\'être ces sources. »',
        body: `**En résumé :** de plus en plus de gens posent leurs questions à **ChatGPT, Perplexity, Gemini** plutôt qu'à Google. Si l'IA ne vous cite pas, vous devenez invisible. L'objectif : **être une source citée**.

## 3 sigles à connaître
- **SEO** : ranker sur Google (la fondation).
- **AEO** *(Answer Engine Optimization)* : apparaître dans les réponses/AI Overviews.
- **GEO** *(Generative Engine Optimization)* : être **cité** par les IA génératives comme source.

> Les 3 sont complémentaires : le SEO nourrit l'AEO, qui nourrit le GEO.`,
      }],
    },
    {
      id: 'vi-m1', title: 'Module 1 — Comment les IA choisissent leurs sources', summary: 'Ce qui fait qu\'une IA vous cite.',
      lessons: [{
        id: 'vi-l1', title: 'Pourquoi une IA cite (ou évite) une marque', durationMin: 14,
        imageUrl: '/courses/visibilite-ia/m1.webp', imageAlt: 'Sources citées par l\'IA', videoUrl: null,
        videoScript: 'Montrer une réponse IA avec citations ; expliquer clarté, structure, autorité, fraîcheur.',
        body: `**En résumé :** les IA privilégient des contenus **clairs, structurés, fiables** qui répondent directement à la question.

## Ce qui favorise la citation
- **Réponses directes** : la question posée → la réponse en haut, sans détour.
- **Structure** : titres clairs, listes, tableaux, FAQ (l'IA « comprend » mieux).
- **Autorité & cohérence** : informations cohérentes sur tout le web (votre site, annuaires, avis).
- **Données structurées (Schema.org)** : aident l'IA à lire et réutiliser votre contenu.
- **Fraîcheur** : contenu à jour.

## À retenir
- Écrire pour **répondre** > écrire pour « se vendre ».
- Structure + clarté + cohérence = citabilité.`,
      }],
      quiz: {
        id: 'vi-q1', title: 'Quiz — Citations IA', passScore: 50,
        questions: [
          { id: 'vi-q1a', question: 'Qu\'est-ce qui aide une IA à vous citer ?', options: ['Un texte long et flou', 'Une réponse directe, structurée, avec données Schema.org', 'Beaucoup de pubs'], correctIndex: 1, explanation: 'Les IA réutilisent les contenus clairs, structurés et fiables qui répondent directement.' },
          { id: 'vi-q1b', question: 'GEO signifie…', options: ['Optimisation géographique', 'Generative Engine Optimization (être cité par les IA)', 'Google Express Online'], correctIndex: 1, explanation: 'GEO = être cité comme source par les moteurs génératifs (ChatGPT, Perplexity…).' },
        ],
      },
    },
    {
      id: 'vi-m2', title: 'Module 2 — Audit & optimisation', summary: 'Mesurer où vous en êtes, puis agir.',
      lessons: [{
        id: 'vi-l2', title: 'L\'audit de citations + plan d\'action', durationMin: 13,
        imageUrl: '/courses/visibilite-ia/m2.webp', imageAlt: 'Audit de visibilité IA', videoUrl: null,
        videoScript: 'Montrer un extrait de rapport : 50 requêtes testées, présence/absence par IA, plan priorisé.',
        body: `**En résumé :** on commence par **mesurer**, puis on optimise les pages clés.

## Le déroulé
1. **Audit initial** : on teste **50+ requêtes** de votre secteur dans chaque IA → où apparaissez-vous (ou pas).
2. **Plan d'action** priorisé : les pages à créer/optimiser pour devenir une source.
3. **Optimisation contenu AEO** : réécriture/structure orientée réponses.
4. **Schema.org** implémenté pour faciliter la lecture par les IA.

## À retenir
- On agit sur des **données**, pas au hasard.
- Priorité aux requêtes à fort enjeu pour votre activité.`,
      }],
    },
    {
      id: 'vi-m3', title: 'Module 3 — Suivi & Brand Radar', summary: 'Suivre votre présence dans le temps.',
      lessons: [{
        id: 'vi-l3', title: 'Tracking mensuel & alertes', durationMin: 11,
        imageUrl: '/courses/visibilite-ia/m3.webp', imageAlt: 'Brand Radar mentions IA', videoUrl: null,
        videoScript: 'Montrer une courbe de mentions IA sur 3 mois + une alerte « votre marque citée par Perplexity ».',
        body: `**En résumé :** la visibilité IA se **suit dans le temps**, comme le SEO.

## Ce que vous recevez
- **Tracking mensuel** : évolution de votre présence dans les IA.
- **Brand Radar** : qui vous cite, à quelle fréquence, dans quel contexte (positif/négatif).
- **Alertes** quand votre marque est citée — ou au contraire évitée.

## À retenir
- C'est un travail de **fond**, mesuré mois par mois.
- Être cité positivement = confiance + trafic de demain.`,
      }],
      quiz: {
        id: 'vi-q3', title: 'Quiz — Suivi', passScore: 50,
        questions: [
          { id: 'vi-q3a', question: 'À quoi sert le Brand Radar ?', options: ['À rien', 'À voir qui vous cite, à quelle fréquence et dans quel contexte', 'À acheter des likes'], correctIndex: 1, explanation: 'Il suit vos mentions par les IA (fréquence, contexte) pour piloter la stratégie.' },
        ],
      },
    },
  ],
}
