import { createClient } from '@/lib/supabase/server'
import { Bell, Star, Mail, FileText, ArrowUpRight } from 'lucide-react'

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  phase_change: ArrowUpRight,
  new_file: FileText,
  review_request: Star,
  ticket_reply: Mail,
}

const NOTIFICATION_LABELS: Record<string, string> = {
  phase_change: 'Changement de phase',
  new_file: 'Nouveau fichier',
  review_request: "Demande d'avis",
  ticket_reply: 'Réponse ticket',
}

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: notifications } = await supabase
    .from('notifications_log')
    .select('*, projects(name)')
    .order('sent_at', { ascending: false })
    .limit(50)

  const stats = {
    total: notifications?.length ?? 0,
    phase_change: notifications?.filter((n) => n.type === 'phase_change').length ?? 0,
    new_file: notifications?.filter((n) => n.type === 'new_file').length ?? 0,
    review_request: notifications?.filter((n) => n.type === 'review_request').length ?? 0,
    ticket_reply: notifications?.filter((n) => n.type === 'ticket_reply').length ?? 0,
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
          Configuration
        </p>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground text-sm mt-1">Configuration du Hub et journal des notifications</p>
      </div>

      {/* Stats KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Emails envoyés', value: stats.total, accent: true },
          { label: 'Changements de phase', value: stats.phase_change, accent: false },
          { label: 'Fichiers déposés', value: stats.new_file, accent: false },
          { label: "Demandes d'avis", value: stats.review_request, accent: false },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border p-5 bg-card"
            style={stat.accent ? { borderColor: 'rgba(244,82,30,0.2)', backgroundColor: 'rgba(244,82,30,0.04)' } : {}}
          >
            <p
              className="text-3xl font-bold"
              style={{ color: stat.accent ? '#F4521E' : undefined }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Config cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <p className="text-sm font-semibold text-foreground mb-4">Configuration emails</p>
          <div className="space-y-3">
            {[
              { label: 'Expéditeur', value: 'hub@vivesmedia.com' },
              { label: 'Admin email', value: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '—' },
              { label: 'Lien avis Google', value: process.env.GOOGLE_REVIEW_URL ? '✓ Configuré' : '⚠ Non configuré' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium text-foreground truncate max-w-[160px]">{value}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              Modifiable dans les variables d'environnement Vercel.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <p className="text-sm font-semibold text-foreground mb-4">Stockage Supabase</p>
          <div className="space-y-3">
            {[
              { label: 'Bucket', value: 'hub-files' },
              { label: 'Accès', value: 'Privé (signed URLs)' },
              { label: 'Durée URL signée', value: '1 heure' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium text-foreground font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification log */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Journal des notifications ({stats.total})
          </h2>
        </div>
        <div className="p-4">
          {!notifications?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune notification envoyée.</p>
          ) : (
            <div className="space-y-0.5">
              {notifications.map((notif) => {
                const Icon = NOTIFICATION_ICONS[notif.type] ?? Bell
                const projectData = Array.isArray(notif.projects) ? notif.projects[0] : notif.projects
                return (
                  <div key={notif.id} className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(244,82,30,0.08)' }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: '#F4521E' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {NOTIFICATION_LABELS[notif.type] ?? notif.type}
                        {projectData?.name && <span className="text-muted-foreground"> · {projectData.name}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{notif.recipient_email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(notif.sent_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
