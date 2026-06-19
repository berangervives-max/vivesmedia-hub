import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PHASE_LABELS, PHASE_ORDER } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { ArrowLeft, Mail, Building2, Phone, ChevronRight, UserCircle } from 'lucide-react'
import ResendInviteButton from '@/components/admin/ResendInviteButton'
import EnrollCourses from '@/components/admin/EnrollCourses'
import { COURSES } from '@/lib/courses'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-50 text-blue-600',
  design: 'bg-purple-50 text-purple-600',
  dev: 'bg-amber-50 text-amber-600',
  recette: 'bg-orange-50 text-orange-600',
  livraison: 'bg-emerald-50 text-emerald-600',
  maintenance: 'bg-secondary text-muted-foreground',
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*, projects(id, name, current_phase, updated_at, is_maintenance)')
    .eq('id', clientId)
    .single()

  if (!client) notFound()

  const { data: enrollRows } = await supabase
    .from('course_enrollments')
    .select('course_slug')
    .eq('client_id', clientId)
  const enrolledSlugs = (enrollRows ?? []).map((e) => e.course_slug)

  const projects = (client.projects as unknown as {
    id: string
    name: string
    current_phase: string
    updated_at: string
    is_maintenance: boolean
  }[] | null) ?? []

  const initials = client.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/admin/clients"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux clients
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white text-lg font-bold"
            style={{ backgroundColor: '#F4521E' }}
          >
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
            {client.company && (
              <p className="text-muted-foreground text-sm">{client.company}</p>
            )}
          </div>
        </div>
        <ResendInviteButton email={client.email} clientName={client.name} clientId={clientId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Contact info */}
        <div className="bg-card rounded-2xl border border-border p-6 md:col-span-1">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <UserCircle className="w-4 h-4" style={{ color: '#F4521E' }} />
            Informations
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                <p className="text-sm font-medium text-foreground break-all">{client.email}</p>
              </div>
            </div>
            {client.company && (
              <div className="flex items-start gap-2.5">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Entreprise</p>
                  <p className="text-sm font-medium text-foreground">{client.company}</p>
                </div>
              </div>
            )}
            {client.phone && (
              <div className="flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Téléphone</p>
                  <p className="text-sm font-medium text-foreground">{client.phone}</p>
                </div>
              </div>
            )}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-0.5">Client depuis</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(client.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:col-span-2 content-start">
          {[
            { value: projects.length, label: 'Projets au total', accent: false },
            { value: projects.filter((p) => p.current_phase !== 'livraison' && p.current_phase !== 'maintenance').length, label: 'En cours', accent: true },
            { value: projects.filter((p) => p.current_phase === 'livraison' || p.current_phase === 'maintenance').length, label: 'Livrés', accent: false },
            { value: projects.filter((p) => p.is_maintenance).length, label: 'Maintenance active', accent: false },
          ].map(({ value, label, accent }) => (
            <div
              key={label}
              className="rounded-2xl border border-border p-4 bg-card"
              style={accent ? { borderColor: 'rgba(244,82,30,0.2)', backgroundColor: 'rgba(244,82,30,0.04)' } : {}}
            >
              <p className="text-2xl font-bold" style={{ color: accent ? '#F4521E' : undefined }}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Projets</p>
          <Link
            href="/admin/clients/new"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            + Nouveau projet
          </Link>
        </div>
        <div className="p-2">
          {!projects.length ? (
            <div className="text-center py-8 bg-secondary/30 rounded-xl m-2">
              <p className="text-sm text-muted-foreground">Aucun projet pour ce client.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {projects.map((project) => {
                const phase = project.current_phase as ProjectPhase
                const phaseIndex = PHASE_ORDER.indexOf(phase)
                const progress = Math.round(((phaseIndex + 1) / PHASE_ORDER.length) * 100)

                return (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-all group"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                        {project.is_maintenance && (
                          <span className="text-[10px] font-medium bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full shrink-0">
                            Maintenance
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 max-w-[120px] bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${progress}%`, backgroundColor: '#F4521E' }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[phase]}`}>
                        {PHASE_LABELS[phase]}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Formations */}
      <div className="mt-6">
        <EnrollCourses
          clientId={clientId}
          courses={COURSES.map((c) => ({ slug: c.slug, title: c.title }))}
          enrolled={enrolledSlugs}
        />
      </div>
    </div>
  )
}
