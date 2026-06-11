import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  review_request: 'Demande d\'avis',
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Paramètres</h1>
        <p className="text-zinc-500 text-sm mt-1">Configuration du Hub et journal des notifications</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Emails envoyés', value: stats.total, color: 'bg-zinc-50' },
          { label: 'Changements de phase', value: stats.phase_change, color: 'bg-purple-50' },
          { label: 'Fichiers déposés', value: stats.new_file, color: 'bg-blue-50' },
          { label: 'Demandes d\'avis', value: stats.review_request, color: 'bg-yellow-50' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5`}>
            <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-700">
              Configuration emails
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-zinc-50">
              <span className="text-xs text-zinc-500">Expéditeur</span>
              <span className="text-xs font-medium text-zinc-900">hub@vivesmedia.com</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-50">
              <span className="text-xs text-zinc-500">Admin email</span>
              <span className="text-xs font-medium text-zinc-900">{process.env.NEXT_PUBLIC_ADMIN_EMAIL}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-zinc-500">Lien avis Google</span>
              <span className="text-xs font-medium text-zinc-900 truncate max-w-[160px]">
                {process.env.GOOGLE_REVIEW_URL ? '✓ Configuré' : '⚠ Non configuré'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 pt-1">
              Modifiable dans les variables d'environnement Vercel.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-700">
              Stockage Supabase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-zinc-50">
              <span className="text-xs text-zinc-500">Bucket</span>
              <span className="text-xs font-medium text-zinc-900 font-mono">hub-files</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-50">
              <span className="text-xs text-zinc-500">Accès</span>
              <span className="text-xs font-medium text-zinc-900">Privé (signed URLs)</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-zinc-500">Durée URL signée</span>
              <span className="text-xs font-medium text-zinc-900">1 heure</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-500" />
            <CardTitle className="text-sm font-semibold text-zinc-700">
              Journal des notifications ({stats.total})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {!notifications?.length ? (
            <p className="text-sm text-zinc-400 text-center py-4">Aucune notification envoyée.</p>
          ) : (
            <div className="space-y-1">
              {notifications.map((notif) => {
                const Icon = NOTIFICATION_ICONS[notif.type] ?? Bell
                const projectData = Array.isArray(notif.projects) ? notif.projects[0] : notif.projects
                return (
                  <div key={notif.id} className="flex items-center gap-3 py-2.5 border-b border-zinc-50 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-900">
                        {NOTIFICATION_LABELS[notif.type] ?? notif.type}
                        {projectData?.name && <span className="text-zinc-500"> · {projectData.name}</span>}
                      </p>
                      <p className="text-xs text-zinc-400">{notif.recipient_email}</p>
                    </div>
                    <span className="text-xs text-zinc-400 shrink-0">
                      {new Date(notif.sent_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
