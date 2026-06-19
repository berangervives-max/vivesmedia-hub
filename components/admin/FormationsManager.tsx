'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, Plus, Pencil, Trash2, Eye, EyeOff, DownloadCloud, Loader2, ArrowUpRight } from 'lucide-react'
import type { CourseListItem } from '@/app/(admin)/admin/formations/page'

export default function FormationsManager({
  initialItems,
  codeCount,
  missingFromDb,
}: {
  initialItems: CourseListItem[]
  codeCount: number
  missingFromDb: number
}) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [busy, setBusy] = useState<string | null>(null)

  async function call(body: unknown) {
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok
  }

  async function seed() {
    setBusy('seed')
    try {
      const res = await fetch('/api/admin/courses/seed', { method: 'POST' })
      if (res.ok) router.refresh()
    } finally {
      setBusy(null)
    }
  }

  async function togglePublish(slug: string, published: boolean) {
    setBusy(slug)
    try {
      if (await call({ action: 'publish', slug, published: !published })) {
        setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, published: !published } : i)))
      }
    } finally {
      setBusy(null)
    }
  }

  async function remove(slug: string) {
    if (!confirm(`Supprimer le cours « ${slug} » de la base ? (le contenu reste dans le code)`)) return
    setBusy(slug)
    try {
      if (await call({ action: 'delete', slug })) {
        setItems((prev) => prev.filter((i) => i.slug !== slug))
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
            vivesmedia.com
          </p>
          <h1 className="text-2xl font-bold text-foreground">Formations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Créez, éditez et publiez les cours de l&apos;espace client.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {missingFromDb > 0 && (
            <Button variant="outline" size="sm" onClick={seed} disabled={busy === 'seed'}>
              {busy === 'seed' ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
              Importer du code ({missingFromDb})
            </Button>
          )}
          <Link href="/admin/formations/new">
            <Button size="sm" style={{ background: '#F4521E' }}>
              <Plus className="w-4 h-4" /> Nouveau cours
            </Button>
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground mb-1">Aucun cours en base</p>
          <p className="text-sm text-muted-foreground mb-5">
            {codeCount} cours existent dans le code. Importez-les pour les rendre éditables, ou créez-en un nouveau.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button size="sm" onClick={seed} disabled={busy === 'seed'} style={{ background: '#F4521E' }}>
              {busy === 'seed' ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
              Importer les {codeCount} cours du code
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {items.map((c) => (
            <div key={c.slug} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground truncate">{c.title}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${c.published ? 'bg-green-50 text-green-700' : 'bg-secondary text-muted-foreground'}`}>
                    {c.published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{c.tagline}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{c.modules} modules · {c.lessons} leçons · {c.level}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/dashboard/formations/${c.slug}`} target="_blank" title="Voir côté client">
                  <Button variant="ghost" size="icon-sm"><ArrowUpRight className="w-4 h-4" /></Button>
                </Link>
                <Button variant="ghost" size="icon-sm" title={c.published ? 'Dépublier' : 'Publier'}
                  disabled={busy === c.slug} onClick={() => togglePublish(c.slug, c.published)}>
                  {busy === c.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : c.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Link href={`/admin/formations/${c.slug}`}>
                  <Button variant="outline" size="sm"><Pencil className="w-4 h-4" /> Éditer</Button>
                </Link>
                <Button variant="ghost" size="icon-sm" title="Supprimer" disabled={busy === c.slug} onClick={() => remove(c.slug)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
