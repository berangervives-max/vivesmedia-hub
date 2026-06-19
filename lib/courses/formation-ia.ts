import type { Course } from './types'

// Contenu du cours « Formation & Accompagnement IA ».
// Source prose : content/services/formation-ia.md — ici structuré en
// modules / leçons / quiz pour le lecteur de cours du Hub.

export const formationIa: Course = {
  slug: 'formation-ia',
  title: 'Formation & Accompagnement IA',
  tagline: "Maîtriser l'IA générative dans votre métier — du premier prompt aux automatisations.",
  level: 'Débutant → Intermédiaire',
  durationLabel: '≈ 2h de contenu + exercices',
  audience: 'Indépendants, dirigeants de TPE/PME, équipes marketing et opérationnelles',
  coverImageUrl: '/courses/formation-ia/cover.webp',
  outcomes: [
    "Comprendre ce qu'est (et n'est pas) une IA générative, ses forces et ses limites",
    'Rédiger des prompts efficaces et reproductibles avec une méthode claire',
    "Intégrer l'IA dans vos tâches quotidiennes (rédaction, emails, devis, analyse)",
    'Vérifier et fiabiliser les résultats (erreurs, biais, hallucinations)',
    'Travailler dans le cadre légal et éthique (RGPD, AI Act)',
  ],
  deliverables: [
    'Workbook d\'exercices personnalisé',
    'Cheat sheet : 20+ prompts prêts à l\'emploi pour votre secteur',
    'Replay vidéo de chaque session',
    'Plan d\'action 30 jours',
    'Attestation de fin de parcours (pack 5 sessions)',
  ],
  modules: [
    {
      id: 'm0-bienvenue',
      title: 'Bienvenue',
      summary: 'Comment fonctionne ce parcours et ce que vous allez en retirer.',
      lessons: [
        {
          id: 'l0-intro',
          title: 'Bienvenue dans votre formation IA',
          durationMin: 5,
          imageUrl: '/courses/formation-ia/cover.webp',
          imageAlt: 'Illustration : un professionnel et l\'IA travaillant ensemble',
          videoUrl: null,
          videoScript:
            `Caméra face. Accueil chaleureux (30s) : « Bienvenue. En 2h, vous allez passer de « je n'ose pas » à « je m'en sers tous les jours ». On part de votre métier, pas de la théorie. » Présenter rapidement les 6 modules à l'écran.`,
          body: `**En résumé :** ce parcours vous rend **autonome** avec l'IA générative, à partir de votre métier réel. 80 % de pratique, 20 % de théorie.

## Comment ça marche

- Chaque **module** = une leçon courte + un **quiz** pour ancrer.
- Vous prenez vos **notes** directement à côté de chaque leçon (elles sont sauvegardées).
- Votre **progression** est suivie : reprenez là où vous vous êtes arrêté.
- À la fin : un **exercice fil rouge** sur un cas réel de votre activité.

## Ce que vous allez obtenir

> Pas des connaissances abstraites — des **réflexes** et des **recettes** réutilisables
> qui vous font gagner du temps dès cette semaine.

Prêt ? On commence par les fondations.`,
        },
      ],
    },
    {
      id: 'm1-fondations',
      title: 'Module 1 — Fondations de l\'IA générative',
      summary: "Comprendre ce qu'est une IA générative et choisir le bon outil.",
      lessons: [
        {
          id: 'l1-fondations',
          title: 'Comprendre l\'IA générative (sans jargon)',
          durationMin: 18,
          imageUrl: '/courses/formation-ia/m1-fondations.webp',
          imageAlt: 'Schéma simplifié du fonctionnement d\'une IA générative',
          videoUrl: null,
          videoScript:
            `Partage d'écran : montrer côte à côte ChatGPT, Claude, Gemini sur une même question. Expliquer en voix off pourquoi les réponses diffèrent. Insister : « l'IA prédit du texte plausible, elle ne « sait » pas — d'où les erreurs. »`,
          body: `**En résumé :** une IA générative produit du contenu (texte, image, code) en
prédisant ce qui est le plus *plausible* — elle ne « comprend » pas comme un humain.
C'est pour ça qu'elle est bluffante… et qu'elle se trompe parfois avec aplomb.

## L'idée clé
Une IA générative est entraînée sur d'énormes quantités de texte. Elle apprend des
**régularités** et génère, mot après mot, la suite la plus probable. Conséquences pratiques :

- Elle est excellente pour **reformuler, structurer, résumer, brainstormer**.
- Elle peut **inventer** des faits (on appelle ça une *hallucination*) → à vérifier.
- Le **contexte que vous donnez** change tout : plus vous êtes précis, meilleur c'est.

## Panorama des outils

| Outil | Point fort |
|-------|-----------|
| **ChatGPT** (OpenAI) | Polyvalent, écosystème riche |
| **Claude** (Anthropic) | Textes longs, nuance, analyse de documents |
| **Gemini** (Google) | Intégré aux outils Google, recherche |
| **Mistral** | Européen, hébergement données UE |

## À retenir
- L'IA **prédit**, elle ne sait pas → toujours relire.
- Le bon outil **dépend de la tâche** (on choisira ensemble selon votre métier).
- Gratuit pour débuter ; payant quand on en fait un usage quotidien.`,
        },
      ],
      quiz: {
        id: 'q1-fondations',
        title: 'Quiz — Fondations',
        passScore: 66,
        questions: [
          {
            id: 'q1a',
            question: 'Comment une IA générative produit-elle sa réponse ?',
            options: [
              'Elle cherche la réponse exacte dans une base de données',
              'Elle prédit la suite la plus plausible, mot après mot',
              'Elle copie un texte existant à l\'identique',
            ],
            correctIndex: 1,
            explanation:
              "L'IA génère du texte plausible à partir de régularités apprises — elle ne récupère pas une réponse stockée, d'où la nécessité de vérifier.",
          },
          {
            id: 'q1b',
            question: 'Qu\'est-ce qu\'une « hallucination » ?',
            options: [
              'Une panne de l\'outil',
              'Une information inventée présentée comme vraie',
              'Une image générée par l\'IA',
            ],
            correctIndex: 1,
            explanation:
              "Une hallucination est une affirmation fausse mais formulée avec assurance. C'est le risque n°1 : on vérifie toujours les faits.",
          },
          {
            id: 'q1c',
            question: 'Qu\'est-ce qui améliore le plus la qualité d\'une réponse ?',
            options: [
              'Écrire en majuscules',
              'Donner du contexte précis dans la demande',
              'Répéter la question plusieurs fois',
            ],
            correctIndex: 1,
            explanation:
              'Plus le contexte est précis (rôle, objectif, format attendu), plus le résultat est exploitable. C\'est tout l\'objet du module suivant.',
          },
        ],
      },
    },
    {
      id: 'm2-prompt',
      title: 'Module 2 — L\'art du prompt',
      summary: 'La méthode pour obtenir un bon résultat en 2-3 essais, pas 20.',
      lessons: [
        {
          id: 'l2-prompt',
          title: 'Rédiger un prompt efficace (méthode C.R.A.F.T.)',
          durationMin: 22,
          imageUrl: '/courses/formation-ia/m2-prompt.webp',
          imageAlt: 'La méthode C.R.A.F.T. de rédaction de prompt',
          videoUrl: null,
          videoScript:
            "Démo live : partir d'un prompt nul (« écris un post LinkedIn »), montrer le résultat fade, puis appliquer C.R.A.F.T. en direct et comparer. Effet « avant/après » très visuel.",
          body: `**En résumé :** un bon prompt n'est pas une question lancée au hasard, c'est une
**commande structurée**. La méthode **C.R.A.F.T.** donne des résultats réguliers.

## La méthode C.R.A.F.T.
- **C — Contexte** : qui vous êtes, votre activité, la situation.
- **R — Rôle** : « Agis comme un expert en… ».
- **A — Action** : la tâche précise (rédige, résume, compare, traduis…).
- **F — Format** : liste, tableau, email, 200 mots, ton…
- **T — Ton** : professionnel, chaleureux, direct…

### Exemple
> *« Tu es expert en communication pour artisans (R). Je suis menuisier à Avignon (C).
> Rédige (A) 3 versions d'un post Instagram de 4 lignes (F), ton chaleureux et local (T),
> pour annoncer une cuisine sur-mesure livrée cette semaine. »*

## Techniques qui changent tout
- **Few-shot** : donnez 1-2 exemples de ce que vous voulez → l'IA imite le style.
- **Chain-of-thought** : demandez « explique ton raisonnement étape par étape » pour
  les tâches d'analyse → moins d'erreurs.
- **Itérer** : « plus court », « plus concret », « garde la 2 mais change l'accroche ».

## À retenir
- Un prompt = **Contexte + Rôle + Action + Format + Ton**.
- Donnez des **exemples** quand le style compte.
- On **itère** : le 1er jet est rarement le bon, et c'est normal.`,
        },
      ],
      quiz: {
        id: 'q2-prompt',
        title: 'Quiz — L\'art du prompt',
        passScore: 66,
        questions: [
          {
            id: 'q2a',
            question: 'Que signifie le « F » de la méthode C.R.A.F.T. ?',
            options: ['Fréquence', 'Format', 'Fiabilité'],
            correctIndex: 1,
            explanation:
              'F = Format : préciser la forme attendue (liste, tableau, email, nombre de mots) évite les allers-retours.',
          },
          {
            id: 'q2b',
            question: 'Donner 1 ou 2 exemples du résultat voulu dans le prompt s\'appelle…',
            options: ['Le few-shot', 'Le zero-shot', 'Le copier-coller'],
            correctIndex: 0,
            explanation:
              'Le few-shot = fournir des exemples. L\'IA s\'en inspire pour coller à votre style. Sans exemple, c\'est du zero-shot.',
          },
          {
            id: 'q2c',
            question: 'Le 1er résultat est moyen. La bonne réflexe ?',
            options: [
              'Abandonner, l\'IA ne sait pas faire',
              'Itérer en précisant ce qu\'on veut changer',
              'Reposer exactement la même question',
            ],
            correctIndex: 1,
            explanation:
              'On itère : « plus court », « plus concret », « change l\'accroche ». La conversation se construit.',
          },
        ],
      },
    },
    {
      id: 'm3-metier',
      title: 'Module 3 — L\'IA dans votre métier',
      summary: 'Construire vos « recettes » réutilisables sur vos tâches réelles.',
      lessons: [
        {
          id: 'l3-metier',
          title: 'Vos cas d\'usage concrets',
          durationMin: 20,
          imageUrl: '/courses/formation-ia/m3-metier.webp',
          imageAlt: 'Cas d\'usage de l\'IA appliqués à différents métiers',
          videoUrl: null,
          videoScript:
            "Montrer 3 recettes prêtes : (1) répondre à un avis client, (2) transformer des notes vocales en compte-rendu, (3) générer 10 idées de posts. Insister sur le fait de SAUVEGARDER ses prompts.",
          body: `**En résumé :** l'IA prend toute sa valeur quand vous en faites des **recettes**
réutilisables sur vos tâches qui reviennent chaque semaine.

## Exemples de recettes
- **Relation client** : « Rédige une réponse polie et utile à cet avis Google (3★) : […] ».
- **Productivité** : « Voici mes notes en vrac de la réunion : fais-en un compte-rendu
  clair avec décisions et prochaines actions. »
- **Marketing** : « Donne 10 idées de posts pour [secteur] ce mois-ci, avec une accroche
  pour chacune. »
- **Devis / emails** : modèles personnalisables en quelques secondes.
- **Analyse simple** : « Résume ce document de 8 pages en 10 points clés. »

## La bonne habitude
Chaque fois qu'un prompt marche bien, **rangez-le** dans votre cheat sheet. Vous
construisez peu à peu votre **bibliothèque de prompts** d'entreprise.

## À retenir
- Visez les tâches **récurrentes** → c'est là que le gain de temps est énorme.
- Transformez vos bons prompts en **recettes** sauvegardées.
- 3 à 5 recettes bien rodées valent mieux que 50 essais dispersés.`,
        },
      ],
      quiz: {
        id: 'q3-metier',
        title: 'Quiz — L\'IA dans votre métier',
        passScore: 66,
        questions: [
          {
            id: 'q3a',
            question: 'Sur quelles tâches l\'IA fait-elle gagner le plus de temps ?',
            options: [
              'Les tâches exceptionnelles et uniques',
              'Les tâches récurrentes qui reviennent souvent',
              'Aucune, il faut tout refaire à la main',
            ],
            correctIndex: 1,
            explanation:
              'Le ROI vient des tâches répétitives : on crée une recette une fois, on la réutilise des dizaines de fois.',
          },
          {
            id: 'q3b',
            question: 'Que faire d\'un prompt qui a très bien marché ?',
            options: [
              'L\'oublier, on improvisera la prochaine fois',
              'Le sauvegarder dans sa cheat sheet de prompts',
              'Le partager publiquement obligatoirement',
            ],
            correctIndex: 1,
            explanation:
              'On le range dans sa bibliothèque de prompts : c\'est un actif réutilisable de votre entreprise.',
          },
        ],
      },
    },
    {
      id: 'm4-fiabiliser',
      title: 'Module 4 — Fiabiliser & vérifier',
      summary: 'Ne jamais diffuser un contenu IA faux, biaisé ou hors-sujet.',
      lessons: [
        {
          id: 'l4-fiabiliser',
          title: 'Repérer les erreurs et vérifier',
          durationMin: 16,
          imageUrl: '/courses/formation-ia/m4-fiabiliser.webp',
          imageAlt: 'Checklist de vérification d\'un contenu généré par IA',
          videoUrl: null,
          videoScript:
            "Montrer une hallucination réelle (demander une source précise, l'IA invente). Puis dérouler la checklist de vérification à l'écran.",
          body: `**En résumé :** l'IA peut se tromper avec assurance. Votre rôle : **vérifier avant
de diffuser**. C'est ce qui sépare un amateur d'un pro de l'IA.

## Repérer une hallucination
- Méfiance sur les **chiffres précis, dates, noms propres, citations, sources**.
- Si l'IA cite une étude/loi → **vérifiez son existence** avant de l'utiliser.
- Demandez : « De quoi es-tu sûr ? Qu'est-ce qui mérite vérification ? »

## La checklist avant diffusion
1. Les **faits** sont-ils exacts (vérifiés à la source) ?
2. Le **ton** correspond-il à votre marque ?
3. Y a-t-il un **biais** ou une formulation maladroite ?
4. Avez-vous **réécrit** au moins une phrase pour que ce soit *vous* ?

> Règle d'or : **l'IA propose, vous validez.** Vous restez responsable de ce que vous publiez.

## À retenir
- Vérifiez systématiquement chiffres, dates, sources.
- Une **checklist** rapide évite 99 % des accidents.
- Le contenu publié, c'est le vôtre — relisez et appropriez-vous-le.`,
        },
      ],
      quiz: {
        id: 'q4-fiabiliser',
        title: 'Quiz — Fiabiliser',
        passScore: 66,
        questions: [
          {
            id: 'q4a',
            question: 'Sur quoi faut-il être le plus méfiant dans une réponse d\'IA ?',
            options: [
              'La mise en forme',
              'Les chiffres, dates, noms et sources précis',
              'La longueur du texte',
            ],
            correctIndex: 1,
            explanation:
              'Les données précises sont les plus sujettes aux hallucinations : on les vérifie toujours à la source.',
          },
          {
            id: 'q4b',
            question: 'Quelle est la « règle d\'or » vue dans ce module ?',
            options: [
              'L\'IA décide, on publie tel quel',
              'L\'IA propose, vous validez',
              'On ne relit jamais pour gagner du temps',
            ],
            correctIndex: 1,
            explanation:
              'Vous restez responsable de ce que vous diffusez : l\'IA propose, l\'humain valide et s\'approprie.',
          },
        ],
      },
    },
    {
      id: 'm5-cadre',
      title: 'Module 5 — Cadre légal, éthique & passage à l\'échelle',
      summary: 'Utiliser l\'IA durablement, en confiance et en règle.',
      lessons: [
        {
          id: 'l5-cadre',
          title: 'RGPD, AI Act et bonnes pratiques',
          durationMin: 15,
          imageUrl: '/courses/formation-ia/m5-cadre.webp',
          imageAlt: 'Cadre légal et éthique de l\'usage de l\'IA',
          videoUrl: null,
          videoScript:
            "Ton rassurant, pas anxiogène. Donner la règle simple sur les données, puis 1 phrase claire sur l'AI Act pour une TPE. Conclure sur la bibliothèque de prompts d'entreprise.",
          body: `**En résumé :** quelques règles simples suffisent pour utiliser l'IA sans risque
juridique, même en TPE/PME.

## Données : la règle simple
- **Ne donnez jamais** de données personnelles sensibles ou confidentielles
  (clients, santé, RIB, contrats) à une IA grand public.
- Anonymisez : remplacez les vrais noms par « Client A » avant de coller un texte.
- Pour des données sensibles → outils avec hébergement UE / offres « entreprise ».

## AI Act (en clair pour une TPE)
Le règlement européen encadre surtout les usages « à risque ». Pour un usage courant
(rédaction, idées, support), l'essentiel est la **transparence** : indiquez quand un
contenu est généré/assisté par IA si le contexte l'exige.

## Passer à l'échelle
- Centralisez vos meilleurs prompts dans une **bibliothèque d'entreprise**.
- Standardisez : mêmes recettes pour toute l'équipe = qualité homogène.
- Étape suivante : **automatiser** (voir le service CRM & Automatisation IA).

## À retenir
- Jamais de données sensibles dans une IA grand public — **anonymisez**.
- AI Act = surtout **transparence** pour un usage courant.
- La bibliothèque de prompts = votre actif qui passe à l'échelle.`,
        },
      ],
      quiz: {
        id: 'q5-cadre',
        title: 'Quiz — Cadre & éthique',
        passScore: 66,
        questions: [
          {
            id: 'q5a',
            question: 'Que faire avant de coller un document client dans une IA grand public ?',
            options: [
              'Rien, c\'est sans risque',
              'Anonymiser les données personnelles/sensibles',
              'Ajouter encore plus de détails personnels',
            ],
            correctIndex: 1,
            explanation:
              'On anonymise (Client A, montant masqué…). Les données sensibles ne vont pas dans une IA grand public.',
          },
          {
            id: 'q5b',
            question: 'Pour un usage courant en TPE, l\'AI Act insiste surtout sur…',
            options: ['La transparence', 'L\'interdiction totale', 'Le paiement d\'une taxe'],
            correctIndex: 0,
            explanation:
              'Pour les usages courants, le maître-mot est la transparence (signaler un contenu généré par IA quand c\'est pertinent).',
          },
        ],
      },
    },
    {
      id: 'm6-pratique',
      title: 'Module 6 — Exercices & validation',
      summary: 'Ancrer par la pratique et valider vos acquis.',
      lessons: [
        {
          id: 'l6-exercices',
          title: 'Workbook, projet fil rouge & validation',
          durationMin: 20,
          imageUrl: '/courses/formation-ia/m6-pratique.webp',
          imageAlt: 'Exercices pratiques et projet fil rouge',
          videoUrl: null,
          videoScript:
            "Présenter le projet fil rouge : choisir UN cas réel et le traiter de A à Z. Encourager : « envoyez-moi votre résultat, on l'affine ensemble. »",
          body: `**En résumé :** la compétence s'ancre par la **pratique**. Voici vos exercices et la
façon dont on valide votre montée en compétence.

## Vos exercices (workbook)
1. **Après le M1** — Testez 3 outils sur une même tâche et comparez les résultats.
2. **Après le M2** — Réécrivez un de vos prompts avec la méthode **C.R.A.F.T.** et
   mesurez la différence.
3. **Après le M3** — Créez **3 prompts-recettes** pour vos tâches récurrentes et
   rangez-les dans votre cheat sheet.
4. **Après le M4** — Passez un contenu IA dans votre **checklist de vérification**
   avant de le diffuser.

## Projet fil rouge
Choisissez **un cas d'usage réel** de votre activité et traitez-le de bout en bout
avec l'IA — de l'idée au livrable final. C'est votre preuve concrète que ça marche
chez vous.

## Validation des acquis
Comme dans une certification professionnelle, on **vérifie que vous savez faire** :
- **Auto-évaluation** début / fin (mesurer le chemin parcouru).
- **Quiz** de fin de module (déjà faits ici 👏).
- **Restitution du projet fil rouge** : vous présentez, on valide ensemble.
- **Attestation** de fin de parcours (pack 5 sessions).

> Bravo : vous avez les réflexes pour utiliser l'IA en confiance, tous les jours.`,
        },
      ],
    },
  ],
}
