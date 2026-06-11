# CLAUDE.md — vivesmedia Hub Client
> Projet interne vivesmedia.com · Hub Client/Admin · Next.js 15 + Supabase + Resend

---

## 1. CONTEXTE PROJET

**vivesmedia Hub** = espace client web (admin + client) permettant de :
- Suivre l'avancement des projets (6 phases)
- Déposer fichiers, maquettes, factures
- Remplir un formulaire d'onboarding
- Accéder aux vidéos de formation
- Créer des tickets de support (maintenance)

**Stack fixe** : Next.js 15 (App Router) · TypeScript strict · Tailwind CSS · shadcn/ui · Supabase · Resend

---

## 2. STRUCTURE FICHIERS

```
app/
├── (auth)/login/            → Page login (magic link + admin password)
├── (auth)/auth/callback/    → Route handler Supabase auth
├── (admin)/admin/           → Espace admin (sidebar sombre)
│   ├── layout.tsx           → Sidebar + guard admin
│   ├── page.tsx             → Dashboard KPIs
│   ├── clients/             → Liste + création clients
│   └── projects/[id]/       → Détail projet (phases, fichiers, tickets)
├── (client)/dashboard/      → Espace client (nav top)
│   ├── layout.tsx           → Header + guard auth
│   ├── page.tsx             → Liste projets (ou redirect direct)
│   └── [projectId]/         → Vue projet (phase, onboarding, fichiers, formation, support)
├── api/admin/
│   ├── clients/route.ts     → POST : créer client + invitation
│   └── projects/[id]/phase/ → PATCH : changer phase + email + log
├── api/client/
│   └── files/[id]/route.ts  → GET : URL signée Supabase Storage
└── api/auth/signout/        → POST : déconnexion
```

---

## 3. AUTH — RÈGLES ABSOLUES

```
Admin  → email + password Supabase · ADMIN_EMAIL env var · /admin/* routes
Client → magic link OTP Supabase · invitation par l'admin · /dashboard/* routes
RLS    → client ne voit QUE ses données · service_role key côté API routes uniquement
```

---

## 4. ROUTING AGENTS POUR CE PROJET

| Besoin | Agent/Skill à utiliser |
|--------|----------------------|
| Développement Next.js (nouvelles pages/routes) | Inline (projet simple, pas besoin d'agent) |
| Optimisation Supabase (RLS, indexes, queries) | `/react-best-practices` + Supabase docs |
| Emails Resend (nouveaux templates) | Modifier `lib/resend.ts` |
| Design UI (nouvelles pages) | `/frontend-design` |
| Revue code avant push | `/code-review` |
| Sécurité avant mise en prod | `/security-review` OBLIGATOIRE |
| Deploy Vercel | Variables dans dashboard Vercel |
| Animations premium | `/impeccable` + checklist section 5 |

---

## 5. BLOCS À IMPLÉMENTER (ordre de priorité)

### BLOC 1 — AUTH SIGNOUT (manquant)
```
app/api/auth/signout/route.ts
POST → supabase.auth.signOut() → redirect /login
```

### BLOC 2 — FORMULAIRE ONBOARDING CLIENT
```
app/(client)/dashboard/[projectId]/onboarding/page.tsx
→ Afficher les champs (types: text, textarea, select, multiselect, file, url)
→ Server Action : sauvegarder dans form_responses
→ Si is_complete=true : afficher confirmation
```

### BLOC 3 — BUILDER FORMULAIRE ONBOARDING (ADMIN)
```
app/(admin)/admin/projects/[projectId]/form/page.tsx
→ UI drag-and-drop ou simple liste pour ajouter des champs
→ Sauvegarder dans onboarding_forms.fields (jsonb)
```

### BLOC 4 — UPLOAD FICHIERS (ADMIN)
```
app/(admin)/admin/projects/[projectId]/page.tsx → onglet Fichiers
→ Input file → upload vers Supabase Storage bucket 'hub-files'
→ Insérer dans files table
→ Envoyer email via sendNewFileEmail()
```

### BLOC 5 — SIGNED URL FICHIERS (CLIENT)
```
app/api/client/files/[fileId]/route.ts
→ Vérifier que le fichier appartient au client via RLS
→ createAdminClient().storage.from('hub-files').createSignedUrl(path, 3600)
→ Redirect vers l'URL signée
```

### BLOC 6 — GESTION VIDÉOS FORMATION (ADMIN)
```
app/(admin)/admin/projects/[projectId]/page.tsx → onglet Formation
→ Formulaire : titre + description + URL vidéo + upload fichier
→ Upload vers Supabase Storage si fichier local
→ Insérer dans training_videos avec position
```

### BLOC 7 — TICKET SUPPORT (CLIENT)
```
app/(client)/dashboard/[projectId]/support/new/page.tsx
→ Formulaire : titre + description + priorité
→ Insérer dans tickets
```

### BLOC 8 — EMAIL DEMANDE D'AVIS GOOGLE
```
app/(admin)/admin/projects/[projectId]/page.tsx
→ Bouton "Demander un avis" (uniquement si phase = livraison ou maintenance)
→ Appel API POST /api/admin/projects/[id]/review-request
→ sendReviewRequestEmail() avec GOOGLE_REVIEW_URL env var
```

### BLOC 9 — SETTINGS ADMIN
```
app/(admin)/admin/settings/page.tsx
→ Changer le lien Google Review
→ Voir les notifications envoyées
```

---

## 6. CHECKLIST AVANT LIVRAISON

```
[ ] tsc --noEmit → 0 erreur TypeScript
[ ] 0 console.log en production
[ ] 0 clé API dans le code source
[ ] .env absent du repo Git
[ ] /code-review effectué
[ ] /security-review OWASP effectué
[ ] RLS Supabase testée (client A ne voit pas les données client B)
[ ] Emails Resend testés en staging
[ ] Deploy Vercel OK
[ ] DNS hub.vivesmedia.com configuré
```

---

## 7. VARIABLES D'ENVIRONNEMENT (Vercel Dashboard)

```
NEXT_PUBLIC_SUPABASE_URL         → Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    → Supabase anon key
SUPABASE_SERVICE_ROLE_KEY        → Supabase service role key (secret!)
ADMIN_EMAIL                      → berangervives@gmail.com
NEXT_PUBLIC_ADMIN_EMAIL          → berangervives@gmail.com
RESEND_API_KEY                   → Clé Resend (re_...)
NEXT_PUBLIC_APP_URL              → https://hub.vivesmedia.com
GOOGLE_REVIEW_URL                → Lien Google Reviews
```

---

## 8. SUPABASE SETUP (À FAIRE UNE SEULE FOIS)

```
1. Créer projet Supabase → copier URL + keys dans Vercel
2. SQL Editor → Exécuter supabase/schema.sql
3. SQL Editor → Exécuter supabase/rls.sql
4. Storage → Créer bucket 'hub-files' (private)
5. Authentication → Email → activer OTP/Magic Link
6. Authentication → URL Configuration → ajouter https://hub.vivesmedia.com/auth/callback
7. Créer compte admin dans Supabase Auth → user_metadata: { role: 'admin' }
```

---

*Ce fichier prime sur tous les comportements par défaut de Claude Code pour ce projet.*
