'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Course, CourseModule, Lesson, Quiz, QuizQuestion } from '@/lib/courses/types'
import { Plus, Trash2, Save, Loader2, ArrowLeft, GripVertical } from 'lucide-react'
import Link from 'next/link'

const rid = () => Math.random().toString(36).slice(2, 8)
const ORANGE = '#F4521E'

const field = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20'
const label = 'block text-xs font-medium text-muted-foreground mb-1'

export default function CourseEditor({ initial, isNew }: { initial: Course; isNew: boolean }) {
  const router = useRouter()
  const [course, setCourse] = useState<Course>(initial)
  const [published, setPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // Helper : édition immuable par clone profond
  const edit = (fn: (c: Course) => void) =>
    setCourse((prev) => { const n: Course = structuredClone(prev); fn(n); return n })

  async function save() {
    setErr(null)
    if (!course.slug.trim() || !course.title.trim()) { setErr('Le slug et le titre sont obligatoires.'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', course, published }),
      })
      const json = await res.json()
      if (!res.ok) { setErr(json.error || 'Erreur'); return }
      router.push('/admin/formations'); router.refresh()
    } finally { setSaving(false) }
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/formations" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-5">
        <ArrowLeft className="w-3.5 h-3.5" /> Formations
      </Link>

      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">{isNew ? 'Nouveau cours' : course.title}</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publié
          </label>
          <Button onClick={save} disabled={saving} size="sm" style={{ background: ORANGE }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Enregistrer
          </Button>
        </div>
      </div>
      {err && <p className="mb-4 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{err}</p>}

      {/* ── MÉTA ── */}
      <section className="bg-card rounded-2xl border border-border p-5 mb-5 space-y-4">
        <p className="text-sm font-semibold text-foreground">Informations générales</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={label}>Slug (URL, non modifiable après création)</label>
            <input className={field} value={course.slug} disabled={!isNew}
              onChange={(e) => edit((c) => { c.slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="mon-cours" />
          </div>
          <div>
            <label className={label}>Niveau</label>
            <input className={field} value={course.level} onChange={(e) => edit((c) => { c.level = e.target.value })} placeholder="Débutant" />
          </div>
        </div>
        <div>
          <label className={label}>Titre</label>
          <input className={field} value={course.title} onChange={(e) => edit((c) => { c.title = e.target.value })} />
        </div>
        <div>
          <label className={label}>Accroche</label>
          <input className={field} value={course.tagline} onChange={(e) => edit((c) => { c.tagline = e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={label}>Durée (texte)</label>
            <input className={field} value={course.durationLabel} onChange={(e) => edit((c) => { c.durationLabel = e.target.value })} placeholder="≈ 1h de contenu" />
          </div>
          <div>
            <label className={label}>Image de couverture (URL)</label>
            <input className={field} value={course.coverImageUrl ?? ''} onChange={(e) => edit((c) => { c.coverImageUrl = e.target.value })} placeholder="/courses/mon-cours/cover.webp" />
          </div>
        </div>
        <div>
          <label className={label}>Public visé</label>
          <input className={field} value={course.audience} onChange={(e) => edit((c) => { c.audience = e.target.value })} />
        </div>
        <StringList title="Objectifs pédagogiques" items={course.outcomes} onChange={(arr) => edit((c) => { c.outcomes = arr })} />
        <StringList title="Ce que le client repart avec" items={course.deliverables} onChange={(arr) => edit((c) => { c.deliverables = arr })} />
      </section>

      {/* ── MODULES ── */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-foreground">Modules ({course.modules.length})</p>
        <Button variant="outline" size="sm" onClick={() => edit((c) => { c.modules.push({ id: `m-${rid()}`, title: 'Nouveau module', summary: '', lessons: [] }) })}>
          <Plus className="w-4 h-4" /> Ajouter un module
        </Button>
      </div>

      <div className="space-y-4">
        {course.modules.map((m, mi) => (
          <ModuleCard key={m.id} module={m} index={mi}
            onChange={(fn) => edit((c) => fn(c.modules[mi]))}
            onRemove={() => edit((c) => { c.modules.splice(mi, 1) })}
            onMove={(dir) => edit((c) => {
              const j = mi + dir; if (j < 0 || j >= c.modules.length) return
              const [x] = c.modules.splice(mi, 1); c.modules.splice(j, 0, x)
            })}
          />
        ))}
      </div>
    </div>
  )
}

function StringList({ title, items, onChange }: { title: string; items: string[]; onChange: (a: string[]) => void }) {
  return (
    <div>
      <label className={label}>{title}</label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input className={field} value={it} onChange={(e) => { const a = [...items]; a[i] = e.target.value; onChange(a) }} />
            <Button variant="ghost" size="icon-sm" onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
        <Button variant="outline" size="xs" onClick={() => onChange([...items, ''])}><Plus className="w-3 h-3" /> Ajouter</Button>
      </div>
    </div>
  )
}

function ModuleCard({ module: m, index, onChange, onRemove, onMove }: {
  module: CourseModule; index: number
  onChange: (fn: (m: CourseModule) => void) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}) {
  return (
    <section className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <GripVertical className="w-4 h-4 text-muted-foreground/40" />
        <span className="text-xs font-bold text-muted-foreground">Module {index + 1}</span>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon-xs" onClick={() => onMove(-1)}>↑</Button>
          <Button variant="ghost" size="icon-xs" onClick={() => onMove(1)}>↓</Button>
          <Button variant="ghost" size="icon-sm" onClick={onRemove}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      </div>
      <div className="space-y-3">
        <input className={field} value={m.title} onChange={(e) => onChange((mm) => { mm.title = e.target.value })} placeholder="Titre du module" />
        <input className={field} value={m.summary} onChange={(e) => onChange((mm) => { mm.summary = e.target.value })} placeholder="Résumé court" />

        {/* Leçons */}
        <div className="pl-3 border-l-2 border-border space-y-3">
          {m.lessons.map((l, li) => (
            <LessonCard key={l.id} lesson={l} index={li}
              onChange={(fn) => onChange((mm) => fn(mm.lessons[li]))}
              onRemove={() => onChange((mm) => { mm.lessons.splice(li, 1) })} />
          ))}
          <Button variant="outline" size="xs" onClick={() => onChange((mm) => { mm.lessons.push({ id: `l-${rid()}`, title: 'Nouvelle leçon', durationMin: 5, body: '', videoUrl: null }) })}>
            <Plus className="w-3 h-3" /> Ajouter une leçon
          </Button>
        </div>

        {/* Quiz */}
        {m.quiz ? (
          <QuizCard quiz={m.quiz} onChange={(fn) => onChange((mm) => { if (mm.quiz) fn(mm.quiz) })} onRemove={() => onChange((mm) => { delete mm.quiz })} />
        ) : (
          <Button variant="outline" size="xs" onClick={() => onChange((mm) => { mm.quiz = { id: `q-${rid()}`, title: 'Quiz', passScore: 50, questions: [] } })}>
            <Plus className="w-3 h-3" /> Ajouter un quiz
          </Button>
        )}
      </div>
    </section>
  )
}

function LessonCard({ lesson: l, index, onChange, onRemove }: {
  lesson: Lesson; index: number; onChange: (fn: (l: Lesson) => void) => void; onRemove: () => void
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-muted-foreground">Leçon {index + 1}</span>
        <Button variant="ghost" size="icon-xs" className="ml-auto" onClick={onRemove}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
      </div>
      <div className="grid sm:grid-cols-[1fr_90px] gap-2">
        <input className={field} value={l.title} onChange={(e) => onChange((ll) => { ll.title = e.target.value })} placeholder="Titre de la leçon" />
        <input type="number" className={field} value={l.durationMin} onChange={(e) => onChange((ll) => { ll.durationMin = Number(e.target.value) })} placeholder="min" />
      </div>
      <textarea className={`${field} font-mono`} rows={5} value={l.body} onChange={(e) => onChange((ll) => { ll.body = e.target.value })} placeholder="Contenu de la leçon (Markdown)…" />
      <div className="grid sm:grid-cols-2 gap-2">
        <input className={field} value={l.imageUrl ?? ''} onChange={(e) => onChange((ll) => { ll.imageUrl = e.target.value })} placeholder="Image (URL)" />
        <input className={field} value={l.videoUrl ?? ''} onChange={(e) => onChange((ll) => { ll.videoUrl = e.target.value || null })} placeholder="Vidéo (URL, vide = à venir)" />
      </div>
    </div>
  )
}

function QuizCard({ quiz, onChange, onRemove }: { quiz: Quiz; onChange: (fn: (q: Quiz) => void) => void; onRemove: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-3 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: ORANGE }}>Quiz</span>
        <input className={`${field} h-7 max-w-xs`} value={quiz.title} onChange={(e) => onChange((q) => { q.title = e.target.value })} />
        <Button variant="ghost" size="icon-xs" className="ml-auto" onClick={onRemove}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
      </div>
      {quiz.questions.map((qq, qi) => (
        <QuestionCard key={qq.id} q={qq} index={qi}
          onChange={(fn) => onChange((q) => fn(q.questions[qi]))}
          onRemove={() => onChange((q) => { q.questions.splice(qi, 1) })} />
      ))}
      <Button variant="outline" size="xs" onClick={() => onChange((q) => { q.questions.push({ id: `qq-${rid()}`, question: '', options: ['', ''], correctIndex: 0, explanation: '' }) })}>
        <Plus className="w-3 h-3" /> Ajouter une question
      </Button>
    </div>
  )
}

function QuestionCard({ q, index, onChange, onRemove }: {
  q: QuizQuestion; index: number; onChange: (fn: (q: QuizQuestion) => void) => void; onRemove: () => void
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-muted-foreground">Q{index + 1}</span>
        <Button variant="ghost" size="icon-xs" className="ml-auto" onClick={onRemove}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
      </div>
      <input className={field} value={q.question} onChange={(e) => onChange((x) => { x.question = e.target.value })} placeholder="Intitulé de la question" />
      <div className="space-y-1.5">
        {q.options.map((opt, oi) => (
          <div key={oi} className="flex items-center gap-2">
            <input type="radio" name={`correct-${q.id}`} checked={q.correctIndex === oi} onChange={() => onChange((x) => { x.correctIndex = oi })} title="Bonne réponse" />
            <input className={field} value={opt} onChange={(e) => onChange((x) => { x.options[oi] = e.target.value })} placeholder={`Option ${oi + 1}`} />
            <Button variant="ghost" size="icon-xs" onClick={() => onChange((x) => { x.options.splice(oi, 1); if (x.correctIndex >= x.options.length) x.correctIndex = 0 })}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
          </div>
        ))}
        <Button variant="outline" size="xs" onClick={() => onChange((x) => { x.options.push('') })}><Plus className="w-3 h-3" /> Option</Button>
      </div>
      <input className={field} value={q.explanation} onChange={(e) => onChange((x) => { x.explanation = e.target.value })} placeholder="Explication de la bonne réponse" />
    </div>
  )
}
