import type { Course } from './types'

export const seo: Course = {
  slug: 'seo',
  title: 'Référencement SEO',
  tagline: 'Être trouvé sur Google par les bons clients — durablement, preuves à l\'appui.',
  level: 'Débutant → Intermédiaire',
  durationLabel: '≈ 1h30 de contenu',
  audience: 'TPE/PME, indépendants, e-commerçants qui veulent du trafic qualifié récurrent',
  coverImageUrl: '/courses/seo/cover.webp',
  outcomes: [
    'Comprendre les 3 piliers du SEO (technique, contenu, autorité)',
    'Identifier les bons mots-clés (volume + intention d\'achat)',
    'Optimiser une page (title, meta, structure, maillage)',
    'Lire un rapport SEO et reconnaître que ça progresse',
    'Comprendre comment se déroule votre accompagnement mensuel',
  ],
  deliverables: [
    'Audit SEO complet (mois 1) avec feuille de route',
    '2 articles de blog optimisés par mois',
    'Suivi de positions sur 20 mots-clés',
    'Rapport mensuel transparent',
  ],
  modules: [
    {
      id: 'seo-m0',
      title: 'Bienvenue',
      summary: 'Ce que vous allez comprendre et comment on travaille ensemble.',
      lessons: [{
        id: 'seo-l0', title: 'Comment fonctionne votre accompagnement SEO', durationMin: 6,
        imageUrl: '/courses/seo/cover.webp', imageAlt: 'Référencement SEO sur Google', videoUrl: null,
        videoScript: 'Rassurer : le SEO n\'est pas magique, c\'est une méthode appliquée mois après mois. Montrer un graphe de trafic qui monte sur 6 mois.',
        body: `**En résumé :** le SEO, c'est tout ce qui fait que votre site **apparaît plus haut sur Google** quand un client cherche votre métier. Ce parcours vous explique comment on s'y prend, pour que vous ne soyez jamais dans le flou.

## Les 3 piliers
1. **Technique** — un site rapide, propre, lisible par Google.
2. **Contenu** — des pages qui répondent précisément aux questions de vos clients.
3. **Autorité** — d'autres sites de confiance qui pointent vers le vôtre.

> Le SEO prend du temps : premiers résultats généralement entre **30 et 90 jours**. C'est un investissement durable, pas une pub qu'on coupe.`,
      }],
    },
    {
      id: 'seo-m1',
      title: 'Module 1 — Mots-clés & intention',
      summary: 'Viser les requêtes qui rapportent, pas le trafic creux.',
      lessons: [{
        id: 'seo-l1', title: 'Mots-clés et intention de recherche', durationMin: 16,
        imageUrl: '/courses/seo/m1.webp', imageAlt: 'Recherche de mots-clés', videoUrl: null,
        videoScript: 'Comparer à l\'écran « plombier » (vague) vs « dépannage fuite chauffe-eau Avignon » (précis, prêt à acheter).',
        body: `**En résumé :** tous les mots-clés ne se valent pas. On vise ceux qui ont du **volume** ET une **intention d'achat**.

## Volume vs intention
- *« plombier »* : beaucoup de volume, très concurrentiel, intention floue.
- *« dépannage fuite chauffe-eau Avignon »* : moins de volume, mais un client **prêt à appeler**.

## Les 3 intentions
- **Informationnelle** : « comment détartrer un chauffe-eau » (la personne s'informe).
- **Navigationnelle** : « avis [votre marque] » (elle vous cherche).
- **Transactionnelle** : « plombier Avignon devis » (elle veut acheter).

On répartit votre contenu sur ces intentions : du contenu qui attire (blog) jusqu'aux pages qui convertissent (services).

## À retenir
- Cibler **intention d'achat** > gros volume creux.
- La **longue traîne** (requêtes précises) convertit mieux.`,
      }],
      quiz: {
        id: 'seo-q1', title: 'Quiz — Mots-clés', passScore: 50,
        questions: [
          { id: 'seo-q1a', question: 'Quel mot-clé a la meilleure intention d\'achat ?', options: ['« plomberie »', '« dépannage fuite chauffe-eau Avignon devis »', '« histoire de la plomberie »'], correctIndex: 1, explanation: 'Précis + local + « devis » = client prêt à acheter. C\'est la longue traîne qui convertit.' },
          { id: 'seo-q1b', question: 'Une requête « comment nettoyer un canapé » est plutôt…', options: ['Transactionnelle', 'Informationnelle', 'Navigationnelle'], correctIndex: 1, explanation: 'La personne s\'informe (TOFU) : bon sujet d\'article de blog pour attirer, pas pour vendre directement.' },
        ],
      },
    },
    {
      id: 'seo-m2',
      title: 'Module 2 — SEO on-page',
      summary: 'Optimiser une page pour Google ET pour l\'humain.',
      lessons: [{
        id: 'seo-l2', title: 'Title, meta, structure et maillage', durationMin: 16,
        imageUrl: '/courses/seo/m2.webp', imageAlt: 'Optimisation on-page', videoUrl: null,
        videoScript: 'Montrer une SERP : où apparaissent le title (lien bleu) et la meta description. Expliquer que c\'est votre « pub » gratuite.',
        body: `**En résumé :** le SEO on-page, c'est tout ce qu'on optimise **sur la page** elle-même.

## Les éléments clés
- **Title** : le lien bleu cliquable dans Google. ~60 caractères, mot-clé + bénéfice. C'est votre **pub gratuite**.
- **Meta description** : le petit texte sous le lien. N'aide pas le classement, mais booste le **taux de clic**.
- **Structure Hn** : un seul H1 (le titre), des H2/H3 logiques. Google lit la hiérarchie.
- **Contenu** : répondre VRAIMENT à la question, mieux que les concurrents.
- **Maillage interne** : des liens entre vos pages pour guider Google et le visiteur.

## À retenir
- Title + meta = votre vitrine dans Google : soignez-les.
- Une page = une intention = un mot-clé principal.`,
      }],
      quiz: {
        id: 'seo-q2', title: 'Quiz — On-page', passScore: 50,
        questions: [
          { id: 'seo-q2a', question: 'À quoi sert surtout la meta description ?', options: ['À grimper directement dans Google', 'À donner envie de cliquer (taux de clic)', 'À rien du tout'], correctIndex: 1, explanation: 'Elle n\'impacte pas le classement directement mais améliore le CTR — donc le trafic.' },
          { id: 'seo-q2b', question: 'Combien de H1 par page idéalement ?', options: ['Un seul', 'Au moins cinq', 'Aucun'], correctIndex: 0, explanation: 'Un seul H1 = le titre principal. Les sous-parties sont en H2/H3.' },
        ],
      },
    },
    {
      id: 'seo-m3',
      title: 'Module 3 — Technique & autorité',
      summary: 'Vitesse, structure, et la puissance des backlinks.',
      lessons: [{
        id: 'seo-l3', title: 'SEO technique & backlinks', durationMin: 15,
        imageUrl: '/courses/seo/m3.webp', imageAlt: 'SEO technique et autorité', videoUrl: null,
        videoScript: 'Montrer un test Core Web Vitals (PageSpeed). Expliquer un backlink avec un schéma simple : un site qui « vote » pour vous.',
        body: `**En résumé :** un beau contenu sur un site lent ou sans autorité ne suffit pas.

## SEO technique
- **Vitesse / Core Web Vitals** : Google favorise les sites rapides, surtout sur mobile.
- **Mobile-first** : Google regarde la version mobile en priorité.
- **Structure propre** : URLs claires, sitemap, robots.txt, balise canonical.

## Autorité (off-page)
- Un **backlink** = un lien d'un autre site vers le vôtre, comme un « vote » de confiance.
- **Tous les liens ne se valent pas** : un lien d'un site reconnu de votre secteur vaut 100 liens douteux.
- ⚠️ On n'**achète jamais** des liens en masse → pénalité Google.

## À retenir
- Site **rapide + mobile** = prérequis.
- L'autorité se construit avec des **liens de qualité**, lentement.`,
      }],
      quiz: {
        id: 'seo-q3', title: 'Quiz — Technique & autorité', passScore: 50,
        questions: [
          { id: 'seo-q3a', question: 'Un backlink de qualité, c\'est…', options: ['N\'importe quel lien, acheté en masse', 'Un lien d\'un site reconnu de votre secteur', 'Un lien interne entre vos pages'], correctIndex: 1, explanation: 'La qualité prime sur la quantité. Acheter des liens en masse = risque de pénalité.' },
          { id: 'seo-q3b', question: 'Pourquoi la vitesse du site compte ?', options: ['Pour rien', 'Google favorise les sites rapides (Core Web Vitals), surtout sur mobile', 'Seulement pour les images'], correctIndex: 1, explanation: 'La performance fait partie des critères de classement et de l\'expérience utilisateur.' },
        ],
      },
    },
    {
      id: 'seo-m4',
      title: 'Module 4 — Mesurer & votre part',
      summary: 'Lire les rapports et savoir reconnaître le succès.',
      lessons: [{
        id: 'seo-l4', title: 'Lire vos résultats + ce qu\'on attend de vous', durationMin: 14,
        imageUrl: '/courses/seo/m4.webp', imageAlt: 'Rapport et indicateurs SEO', videoUrl: null,
        videoScript: 'Montrer un rapport type : impressions, clics, CTR, position moyenne. Insister sur l\'indicateur final = conversions.',
        body: `**En résumé :** on mesure tout, et chaque mois vous recevez un rapport clair.

## Lire un rapport
- **Impressions** : combien de fois vous êtes apparu dans Google.
- **Clics** : combien ont cliqué.
- **CTR** : clics / impressions (taux de clic).
- **Position moyenne** : où vous vous situez.
- **Conversions** : formulaires, appels, ventes — **l'indicateur qui compte vraiment**.

## Votre part (c'est un travail d'équipe)
- ✅ Valider les sujets d'articles proposés.
- ✅ Nous transmettre votre expertise métier (on rédige, vous corrigez les faits).
- ✅ Répondre aux avis Google et tenir votre fiche à jour (SEO local).

## À retenir
- Objectif = **plus de clients qui vous trouvent**, pas des « jolis chiffres ».
- Le SEO est durable : l'effort d'aujourd'hui paie pendant des mois.`,
      }],
      quiz: {
        id: 'seo-q4', title: 'Quiz — Mesure', passScore: 50,
        questions: [
          { id: 'seo-q4a', question: 'Quel est l\'indicateur le plus important ?', options: ['Le nombre d\'impressions', 'Les conversions (clients/appels/ventes)', 'La couleur du rapport'], correctIndex: 1, explanation: 'Le trafic ne sert à rien s\'il ne convertit pas. La conversion est le vrai but.' },
        ],
      },
    },
  ],
}
