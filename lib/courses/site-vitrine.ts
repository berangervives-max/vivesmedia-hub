import type { Course } from './types'

export const siteVitrine: Course = {
  slug: 'site-vitrine',
  title: 'Site Vitrine',
  tagline: 'Votre première impression en ligne, irréprochable — et comment en tirer parti.',
  level: 'Débutant',
  durationLabel: '≈ 1h de contenu',
  audience: 'Indépendants, artisans, professions libérales, petites entreprises de services',
  coverImageUrl: '/courses/site-vitrine/cover.webp',
  outcomes: [
    'Comprendre comment se déroule la création de votre site, étape par étape',
    'Savoir donner un retour utile sur une maquette',
    'Gérer vos textes et photos en autonomie après livraison',
    'Recevoir et traiter les demandes de contact',
    'Comprendre ce qui rend un site vitrine performant',
  ],
  deliverables: [
    'Site 5 pages sur-mesure', 'Hébergement + domaine 1 an offert', 'SSL + RGPD inclus',
    'Google Analytics intégré', '1h de formation admin',
  ],
  modules: [
    {
      id: 'sv-m0', title: 'Bienvenue', summary: 'Ce que vous avez commandé et comment ça se passe.',
      lessons: [{
        id: 'sv-l0', title: 'Votre site vitrine, de A à Z', durationMin: 6,
        imageUrl: '/courses/site-vitrine/cover.webp', imageAlt: 'Site vitrine professionnel', videoUrl: null,
        videoScript: 'Montrer un exemple de site vitrine livré. Rassurer : « vous validez chaque étape, rien n\'est imposé. »',
        body: `**En résumé :** un site vitrine présente votre activité et **transforme un visiteur en prise de contact**. Ce parcours vous accompagne du brief à l'autonomie.

## Ce qui est inclus
- **5 pages** : Accueil, À propos, Services, Réalisations/Galerie, Contact.
- Design **100% sur-mesure** (aucun template revendu), responsive mobile.
- **Hébergement + domaine** 1ʳᵉ année offerts, **SSL** (HTTPS), pages légales **RGPD**.
- **Google Analytics** + 1h de formation admin.

> Délai indicatif : ~10 jours. Vous restez l'unique interlocuteur, du début à la fin.`,
      }],
    },
    {
      id: 'sv-m1', title: 'Module 1 — Le déroulé du projet', summary: 'Les 4 étapes, et votre rôle à chacune.',
      lessons: [{
        id: 'sv-l1', title: 'Brief → Maquette → Dev → Mise en ligne', durationMin: 14,
        imageUrl: '/courses/site-vitrine/m1.webp', imageAlt: 'Étapes du projet', videoUrl: null,
        videoScript: 'Dérouler une frise des 4 étapes. Insister sur les 2 rounds de corrections inclus à l\'étape maquette.',
        body: `**En résumé :** le projet suit 4 étapes claires.

1. **Brief (30 min)** — on comprend votre activité, vos clients, ce qui vous différencie.
2. **Maquette (48h)** — je vous présente le design. **2 rounds de corrections inclus**. Rien n'est codé avant votre validation.
3. **Développement** — intégration, SEO, performances, pages légales.
4. **Mise en ligne** — votre site est live. Je reste dispo **30 jours** pour toute correction.

## Votre rôle
- Fournir vos **contenus** (textes, logo, photos) — ou on s'en occupe.
- **Valider** chaque étape rapidement pour ne pas ralentir le projet.

## À retenir
- Vous **validez avant chaque passage** à l'étape suivante.
- Plus vos retours sont précis, plus c'est rapide.`,
      }],
      quiz: {
        id: 'sv-q1', title: 'Quiz — Déroulé', passScore: 50,
        questions: [
          { id: 'sv-q1a', question: 'Quand le développement commence-t-il ?', options: ['Avant la maquette', 'Après votre validation de la maquette', 'Jamais'], correctIndex: 1, explanation: 'On ne code rien avant que vous ayez validé le design — pas de mauvaise surprise.' },
          { id: 'sv-q1b', question: 'Combien de rounds de corrections sur la maquette ?', options: ['Zéro', 'Deux', 'Illimité'], correctIndex: 1, explanation: '2 rounds de corrections sont inclus à l\'étape maquette.' },
        ],
      },
    },
    {
      id: 'sv-m2', title: 'Module 2 — Donner un bon retour', summary: 'Des retours qui font avancer la maquette.',
      lessons: [{
        id: 'sv-l2', title: 'L\'art du retour constructif', durationMin: 10,
        imageUrl: '/courses/site-vitrine/m2.webp', imageAlt: 'Retour sur maquette', videoUrl: null,
        videoScript: 'Opposer un retour vague (« j\'aime pas ») à un retour utile (« le bouton se voit peu, mets-le en orange »).',
        body: `**En résumé :** un bon retour accélère et améliore le résultat.

## La méthode
- Dites le **problème** et l'**objectif**, pas la solution technique : « les visiteurs ne voient pas comment me contacter » plutôt que « mets un bouton là ».
- Soyez **spécifique** : « le titre d'accueil ne parle pas de mon métier » > « ça fait pas pro ».
- **Priorisez** : distinguez « bloquant » de « détail ».
- Regardez sur **mobile aussi** (la majorité de vos visiteurs).

## À retenir
- Décrivez le **besoin**, je trouve la solution design.
- Un retour clair = moins d'allers-retours = livraison plus rapide.`,
      }],
    },
    {
      id: 'sv-m3', title: 'Module 3 — Prendre en main votre site', summary: 'Modifier textes/photos et lire vos contacts.',
      lessons: [{
        id: 'sv-l3', title: 'Gérer vos contenus + recevoir les demandes', durationMin: 14,
        imageUrl: '/courses/site-vitrine/m3.webp', imageAlt: 'Administration du site', videoUrl: null,
        videoScript: 'Démo admin : modifier un texte, remplacer une photo, où arrivent les messages du formulaire de contact.',
        body: `**En résumé :** après la formation d'1h, vous gérez vos contenus seul.

## Ce que vous pouvez faire
- **Modifier vos textes** et **remplacer vos photos** depuis l'admin.
- Recevoir les **demandes de contact** directement par email (protection anti-spam incluse).
- Suivre vos visiteurs dans **Google Analytics** (combien, d'où ils viennent).

## Bonnes pratiques
- Photos **optimisées** (pas de fichiers de 10 Mo) → site rapide.
- Répondez **vite** aux demandes : un prospect qui attend va voir ailleurs.

## À retenir
- Vous êtes **autonome** sur les contenus dès le 1er jour.
- Pour le reste, le support reste disponible 30 jours (puis option Maintenance).`,
      }],
      quiz: {
        id: 'sv-q3', title: 'Quiz — Prise en main', passScore: 50,
        questions: [
          { id: 'sv-q3a', question: 'Où arrivent les demandes du formulaire de contact ?', options: ['Nulle part', 'Directement dans votre boîte email', 'Uniquement chez l\'agence'], correctIndex: 1, explanation: 'Chaque demande vous parvient par email instantanément (avec anti-spam).' },
          { id: 'sv-q3b', question: 'Pourquoi optimiser le poids des photos ?', options: ['Pour rien', 'Pour garder un site rapide (et bon SEO)', 'Pour remplir l\'espace disque'], correctIndex: 1, explanation: 'Des images légères = site rapide = meilleure expérience et meilleur référencement.' },
        ],
      },
    },
  ],
}
