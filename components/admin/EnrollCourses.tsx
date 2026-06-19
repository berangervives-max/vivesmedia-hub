'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GraduationCap, Check, Plus, Loader2 } from 'lucide-react'

type CourseLite = { slug: string; title: string }

export default function EnrollCourses({
  clientId,
  courses,
  enrolled,
}: {
  clientId: string
  courses: CourseLite[]
  enrolled: string[]
}) {
  const [active, setActive] = useState<Set<string>>(new Set(enrolled))
  const [loading, setLoading] = useState<string | null>(null)

  const toggle = async (slug: string) => {
    const isEnrolled = active.has(slug)
    setLoading(slug)
    try {
      const res = await fetch('/api/admin/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, courseSlug: slug, action: isEnrolled ? 'revoke' : 'grant' }),
      })
      if (res.ok) {
        setActive((prev) => {
          const next = new Set(prev)
          if (isEnrolled) next.delete(slug)
          else next.add(slug)
          return next
        })
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-card rounded-2xl border border-border">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <GraduationCap className="w-4 h-4" style={{ color: '#F4521E' }} />
        <p className="text-sm font-semibold text-foreground">Accès aux formations</p>
      </div>
      <div className="p-3 space-y-1">
        {courses.map((c) => {
          const on = active.has(c.slug)
          const busy = loading === c.slug
          return (
            <div key={c.slug} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${on ? 'bg-green-50 text-green-700' : 'bg-secondary text-muted-foreground'}`}>
                  {on ? 'Accès actif' : 'Pas d\'accès'}
                </span>
                <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
              </div>
              <Button size="sm" variant={on ? 'outline' : 'default'} disabled={busy} onClick={() => toggle(c.slug)}
                style={on ? undefined : { background: '#F4521E' }}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : on ? (<><Check className="w-4 h-4" /> Retirer</>) : (<><Plus className="w-4 h-4" /> Donner accès</>)}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
