import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PHASE_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { Plus, Mail, Building2, FolderOpen } from 'lucide-react'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*, projects(id, name, current_phase)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Clients</h1>
          <p className="text-zinc-500 text-sm mt-1">{clients?.length ?? 0} clients au total</p>
        </div>
        <Link href="/admin/clients/new">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau client
          </Button>
        </Link>
      </div>

      {!clients?.length ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100">
          <p className="text-zinc-400 text-sm">Aucun client pour l'instant.</p>
          <Link href="/admin/clients/new" className="mt-4 inline-block">
            <Button size="sm" className="gap-2 mt-4">
              <Plus className="w-4 h-4" />
              Créer le premier client
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left text-xs text-zinc-400 font-medium px-5 py-3">Client</th>
                <th className="text-left text-xs text-zinc-400 font-medium px-5 py-3">Email</th>
                <th className="text-left text-xs text-zinc-400 font-medium px-5 py-3">Entreprise</th>
                <th className="text-left text-xs text-zinc-400 font-medium px-5 py-3">Projets</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-zinc-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-zinc-500">{client.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-zinc-500">{client.company ?? '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(client.projects as unknown as { id: string; name: string; current_phase: ProjectPhase }[] | null)?.map((p) => (
                        <span
                          key={p.id}
                          className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600"
                        >
                          {p.name} · {PHASE_LABELS[p.current_phase]}
                        </span>
                      )) ?? <span className="text-xs text-zinc-400">Aucun projet</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
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
