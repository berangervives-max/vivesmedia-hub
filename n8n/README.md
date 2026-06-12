# n8n Workflows — vivesmedia Hub

4 workflows prêts à importer dans votre instance n8n.

## Import

1. Ouvrir n8n → **Workflows** → **Import from file**
2. Sélectionner le fichier JSON souhaité
3. Configurer les credentials manquants (voir ci-dessous)
4. Activer le workflow

## Credentials requis

| Service | Credential n8n | Usage |
|---------|---------------|-------|
| Supabase | `Supabase API` | Lecture/écriture base de données |
| Resend | `Resend API` ou `SMTP` | Envoi d'emails |
| Gmail (optionnel) | `Gmail OAuth2` | Alertes admin sur Gmail |

## Workflows disponibles

| Fichier | Déclencheur | Action |
|---------|------------|--------|
| `01-new-client-onboarding.json` | Webhook (Supabase) | Email de bienvenue + rappel J+3 si onboarding non complété |
| `02-phase-change-notification.json` | Webhook (Supabase) | Email client + log interne lors d'un changement de phase |
| `03-ticket-urgent-alert.json` | Webhook (Supabase) | Alerte immédiate Béranger si ticket priorité "high" |
| `04-weekly-digest.json` | Cron (lundi 9h) | Résumé hebdo : tickets ouverts, projets actifs, onboarding en attente |

## Configuration Supabase Webhooks

Pour déclencher les workflows automatiquement, configurer des Database Webhooks dans Supabase :

**Settings → API → Database Webhooks → Enable**

| Table | Event | URL webhook |
|-------|-------|-------------|
| `projects` | INSERT | `{N8N_URL}/webhook/new-client-onboarding` |
| `phase_history` | INSERT | `{N8N_URL}/webhook/phase-change` |
| `tickets` | INSERT | `{N8N_URL}/webhook/ticket-created` |
