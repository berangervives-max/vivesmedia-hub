import type { Course } from './types'

export const videoContenuIa: Course = {
  slug: 'video-contenu-ia',
  title: 'Vidéo & Contenu IA',
  tagline: 'Un flux régulier de vidéos qui performent — sans tourner vous-même.',
  level: 'Débutant',
  durationLabel: '≈ 1h de contenu',
  audience: 'Marques, commerces, indépendants qui veulent être présents sur les réseaux',
  coverImageUrl: '/courses/video-contenu-ia/cover.webp',
  outcomes: [
    'Comprendre comment vos vidéos sont produites (et avec quels outils)',
    'Définir votre style de marque une fois pour toutes',
    'Valider un calendrier éditorial mensuel efficacement',
    'Publier vos vidéos au bon format et au bon moment',
    'Lire l\'engagement et savoir ce qui marche',
  ],
  deliverables: [
    '8 à 16 vidéos/mois', 'Format Reels 9:16 + desktop 16:9', 'Calendrier éditorial mensuel',
    'Copywriting + sous-titres inclus', 'Livraison MP4 prêts à poster',
  ],
  modules: [
    {
      id: 'vc-m0', title: 'Bienvenue', summary: 'Comment fonctionne votre abonnement vidéo.',
      lessons: [{
        id: 'vc-l0', title: 'Le service en 5 minutes', durationMin: 5,
        imageUrl: '/courses/video-contenu-ia/cover.webp', imageAlt: 'Production vidéo IA', videoUrl: null,
        videoScript: 'Montrer 2-3 exemples de Reels produits en IA. Préciser : « vous validez avant production, vous postez (ou je poste). »',
        body: `**En résumé :** chaque mois, vous recevez **8 à 16 vidéos** prêtes à poster, produites avec des outils IA pro. Vous gardez la main : vous validez le plan avant production.

## Le cycle mensuel
1. **Calendrier** proposé (4 semaines de sujets).
2. Vous **approuvez/ajustez**.
3. **Production IA** (vidéo, sous-titres, musique, textes).
4. **Livraison hebdo** : MP4 + légendes dans votre boîte mail chaque lundi.

> Formats : **Reels 9:16** (Insta/TikTok/Shorts) + **16:9** (LinkedIn/site).`,
      }],
    },
    {
      id: 'vc-m1', title: 'Module 1 — Votre style de marque', summary: 'Couleurs, ton, thèmes : la base.',
      lessons: [{
        id: 'vc-l1', title: 'Définir votre identité vidéo', durationMin: 12,
        imageUrl: '/courses/video-contenu-ia/m1.webp', imageAlt: 'Identité de marque vidéo', videoUrl: null,
        videoScript: 'Montrer une mini charte : palette, police, ton (sérieux/fun), exemples de marques cohérentes.',
        body: `**En résumé :** on définit votre **style une fois**, puis tout reste cohérent.

## Ce qu'on cadre ensemble
- **Couleurs & police** (votre charte).
- **Ton** : expert, fun, premium, proximité… ?
- **Thèmes récurrents** : conseils, coulisses, produits, témoignages.
- **Do & don't** : ce qu'on montre, ce qu'on évite.

## Pourquoi c'est clé
La cohérence rend votre marque **reconnaissable** en 1 seconde dans un fil d'actu saturé.

## À retenir
- Un style clair = des vidéos qu'on reconnaît immédiatement.
- Mieux vaut **1 angle fort** que 10 styles dispersés.`,
      }],
      quiz: {
        id: 'vc-q1', title: 'Quiz — Style', passScore: 50,
        questions: [
          { id: 'vc-q1a', question: 'Pourquoi figer un style de marque ?', options: ['Pour brider la créativité', 'Pour être reconnaissable instantanément', 'Pour rien'], correctIndex: 1, explanation: 'La cohérence visuelle/ton rend la marque mémorable dans un fil saturé.' },
        ],
      },
    },
    {
      id: 'vc-m2', title: 'Module 2 — Le calendrier éditorial', summary: 'Valider vite, publier régulièrement.',
      lessons: [{
        id: 'vc-l2', title: 'Approuver le calendrier + cadence', durationMin: 12,
        imageUrl: '/courses/video-contenu-ia/m2.webp', imageAlt: 'Calendrier éditorial', videoUrl: null,
        videoScript: 'Montrer un calendrier 4 semaines avec sujets et accroches ; expliquer la régularité > la perfection.',
        body: `**En résumé :** la **régularité** bat la perfection. Le calendrier vous donne de la visibilité.

## Bien valider
- Vérifiez l'**alignement** avec vos temps forts (promos, événements, saisons).
- Ajoutez vos **idées** (un produit à pousser, une actu).
- Validez **groupé** (gain de temps) plutôt qu'au compte-gouttes.

## La cadence
- 1 à 2 vidéos/semaine selon la formule → l'algorithme aime la **régularité**.

## À retenir
- Publier **régulièrement** > publier « parfait » de temps en temps.
- Anticipez vos temps forts dans le calendrier.`,
      }],
    },
    {
      id: 'vc-m3', title: 'Module 3 — Publier & mesurer', summary: 'Bon format, bon moment, bons indicateurs.',
      lessons: [{
        id: 'vc-l3', title: 'Publication & lecture de l\'engagement', durationMin: 12,
        imageUrl: '/courses/video-contenu-ia/m3.webp', imageAlt: 'Engagement réseaux sociaux', videoUrl: null,
        videoScript: 'Montrer où regarder les vues/rétention/partages ; expliquer le « hook » des 3 premières secondes.',
        body: `**En résumé :** une bonne vidéo mal publiée ne sert à rien — et l'inverse aussi.

## Publier
- **Bon format par plateforme** (9:16 vertical pour Reels/TikTok/Shorts).
- **Sous-titres** toujours (la majorité regarde sans le son) — inclus.
- **Accroche** dans les 3 premières secondes (le « hook »).

## Mesurer
- **Vues**, **rétention** (combien regardent jusqu'au bout), **partages/enregistrements**.
- Les partages/enregistrements pèsent plus que les likes pour l'algorithme.

## À retenir
- Les 3 premières secondes décident de tout.
- Suivez la **rétention** et les **partages**, pas que les vues.`,
      }],
      quiz: {
        id: 'vc-q3', title: 'Quiz — Publication', passScore: 50,
        questions: [
          { id: 'vc-q3a', question: 'Pourquoi mettre des sous-titres ?', options: ['Pour décorer', 'Parce que beaucoup regardent sans le son', 'Pour ralentir la vidéo'], correctIndex: 1, explanation: 'La majorité scrolle en silence : sans sous-titres, le message est perdu.' },
          { id: 'vc-q3b', question: 'Quel moment est décisif dans une vidéo courte ?', options: ['La fin', 'Les 3 premières secondes (le hook)', 'Le générique'], correctIndex: 1, explanation: 'Le hook initial décide si la personne continue ou scrolle.' },
        ],
      },
    },
  ],
}
