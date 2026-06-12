import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PHASE_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { Plus } from 'lucide-react'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*, projects(id, name, current_phase)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
            Gestion
          </p>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">{clients?.length ?? 0} clients au total</p>
        </div>
        <Link
          href="/admin/clients/new"
          className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-all"
          style={{ backgroundColor: '#F4521E' }}
        >
          <Plus className="w-4 h-4" />
          Nouveau client
        </Link>
      </div>

      {!clients?.length ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm mb-4">Aucun client pour l'instant.</p>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-all"
            style={{ backgroundColor: '#F4521E' }}
          >
            <Plus className="w-4 h-4" />
            Créer le premier client
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Client</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Email</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Entreprise</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Projets</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                        style={{ backgroundColor: '#F4521E' }}
                      >
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-foreground">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">{client.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">{client.company ?? '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(client.projects as unknown as { id: string; name: string; current_phase: ProjectPhase }[] | null)?.map((p) => (
                        <span
                          key={p.id}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground"
                        >
                          {p.name} · {PHASE_LABELS[p.current_phase]}
                        </span>
                      )) ?? <span className="text-xs text-muted-foreground">Aucun projet</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Gérer →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
