'use client'

import { useMemo, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Course, CourseModule, Lesson, Quiz } from '@/lib/courses/types'
import { lessonCount } from '@/lib/courses/types'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  CheckCircle2, Circle, PlayCircle, HelpCircle, Menu, ChevronLeft, ChevronRight,
  NotebookPen, Clock, Video, Award, X,
} from 'lucide-react'

type Step =
  | { kind: 'lesson'; moduleId: string; moduleTitle: string; lesson: Lesson }
  | { kind: 'quiz'; moduleId: string; moduleTitle: string; quiz: Quiz }

function buildSteps(course: Course): Step[] {
  const steps: Step[] = []
  for (const m of course.modules) {
    for (const l of m.lessons) steps.push({ kind: 'lesson', moduleId: m.id, moduleTitle: m.title, lesson: l })
    if (m.quiz) steps.push({ kind: 'quiz', moduleId: m.id, moduleTitle: m.title, quiz: m.quiz })
  }
  return steps
}

const ORANGE = '#F4521E'

export default function CoursePlayer({
  course,
  initialCompleted,
  initialNotes,
  canSave,
}: {
  course: Course
  initialCompleted: string[]
  initialNotes: Record<string, string>
  canSave: boolean
}) {
  const steps = useMemo(() => buildSteps(course), [course])
  const [activeIndex, setActiveIndex] = useState(0)
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted))
  const [navOpen, setNavOpen] = useState(false)

  const total = lessonCount(course)
  const done = completed.size
  const pct = total ? Math.round((done / total) * 100) : 0
  const step = steps[activeIndex]

  const post = useCallback(async (url: string, body: unknown) => {
    if (!canSave) return
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
      /* silencieux : pas bloquant */
    }
  }, [canSave])

  const setLessonComplete = useCallback((lessonId: string, value: boolean) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (value) next.add(lessonId)
      else next.delete(lessonId)
      return next
    })
    post('/api/client/courses/progress', { courseSlug: course.slug, lessonId, completed: value })
  }, [course.slug, post])

  const goTo = (i: number) => {
    setActiveIndex(Math.max(0, Math.min(steps.length - 1, i)))
    setNavOpen(false)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const next = () => {
    if (step.kind === 'lesson' && !completed.has(step.lesson.id)) setLessonComplete(step.lesson.id, true)
    goTo(activeIndex + 1)
  }

  // ─── Sidebar (sommaire) ────────────────────────────────────────────────
  const Sidebar = (
    <nav className="flex flex-col gap-5">
      {course.modules.map((m) => (
        <ModuleNav
          key={m.id}
          module={m}
          steps={steps}
          activeIndex={activeIndex}
          completed={completed}
          onSelect={(i) => goTo(i)}
        />
      ))}
    </nav>
  )

  return (
    <div>
      {/* En-tête cours + progression */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: ORANGE }}>
          {course.level}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{course.title}</h1>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: ORANGE }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{done}/{total} · {pct}%</span>
        </div>
      </div>

      {/* Bouton sommaire (mobile) */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden mb-4 w-full justify-start"
        onClick={() => setNavOpen(true)}
      >
        <Menu className="w-4 h-4" /> Sommaire du cours
      </Button>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          {Sidebar}
        </aside>

        {/* Sidebar mobile (Sheet) */}
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent side="left" className="w-[85%] max-w-sm overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-heading text-base font-medium">Sommaire</p>
              <button onClick={() => setNavOpen(false)} aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>
            {Sidebar}
          </SheetContent>
        </Sheet>

        {/* Contenu */}
        <div className="min-w-0">
          {step.kind === 'lesson' ? (
            <LessonView
              key={step.lesson.id}
              lesson={step.lesson}
              moduleTitle={step.moduleTitle}
              isDone={completed.has(step.lesson.id)}
              onToggleDone={() => setLessonComplete(step.lesson.id, !completed.has(step.lesson.id))}
              initialNote={initialNotes[step.lesson.id] ?? ''}
              courseSlug={course.slug}
              canSave={canSave}
            />
          ) : (
            <QuizBlock key={step.quiz.id} quiz={step.quiz} courseSlug={course.slug} canSave={canSave} />
          )}

          {/* Navigation bas */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
            <Button variant="outline" size="sm" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}>
              <ChevronLeft className="w-4 h-4" /> Précédent
            </Button>
            <span className="text-xs text-muted-foreground">{activeIndex + 1} / {steps.length}</span>
            {activeIndex < steps.length - 1 ? (
              <Button size="sm" onClick={next} style={{ background: ORANGE }}>
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
                <Award className="w-4 h-4" /> Fin du cours
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sous-composants ──────────────────────────────────────────────────────

function ModuleNav({
  module: m, steps, activeIndex, completed, onSelect,
}: {
  module: CourseModule
  steps: Step[]
  activeIndex: number
  completed: Set<string>
  onSelect: (i: number) => void
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{m.title}</p>
      <ul className="space-y-0.5">
        {steps.map((s, i) => {
          if (s.moduleId !== m.id) return null
          const active = i === activeIndex
          const isLesson = s.kind === 'lesson'
          const isDone = isLesson && completed.has((s as Extract<Step, { kind: 'lesson' }>).lesson.id)
          const label = isLesson
            ? (s as Extract<Step, { kind: 'lesson' }>).lesson.title
            : (s as Extract<Step, { kind: 'quiz' }>).quiz.title
          const Icon = isDone ? CheckCircle2 : isLesson ? (active ? PlayCircle : Circle) : HelpCircle
          return (
            <li key={i}>
              <button
                onClick={() => onSelect(i)}
                className={`w-full text-left flex items-start gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  active ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0" style={isDone ? { color: '#16a34a' } : active ? { color: ORANGE } : undefined} />
                <span className="leading-snug">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const MD_COMPONENTS: Components = {
  h2: (p: React.ComponentProps<'h2'>) => <h2 className="text-lg font-bold text-foreground mt-7 mb-3" {...p} />,
  h3: (p: React.ComponentProps<'h3'>) => <h3 className="text-base font-bold text-foreground mt-5 mb-2" {...p} />,
  p: (p: React.ComponentProps<'p'>) => <p className="text-[15px] text-foreground/80 leading-relaxed my-3" {...p} />,
  ul: (p: React.ComponentProps<'ul'>) => <ul className="list-disc pl-5 space-y-1.5 my-3 text-[15px] text-foreground/80" {...p} />,
  ol: (p: React.ComponentProps<'ol'>) => <ol className="list-decimal pl-5 space-y-1.5 my-3 text-[15px] text-foreground/80" {...p} />,
  li: (p: React.ComponentProps<'li'>) => <li className="leading-relaxed" {...p} />,
  strong: (p: React.ComponentProps<'strong'>) => <strong className="font-semibold text-foreground" {...p} />,
  a: (p: React.ComponentProps<'a'>) => <a className="underline" style={{ color: ORANGE }} target="_blank" rel="noopener noreferrer" {...p} />,
  blockquote: (p: React.ComponentProps<'blockquote'>) => (
    <blockquote className="border-l-2 pl-4 my-4 text-foreground/70 italic" style={{ borderColor: ORANGE }} {...p} />
  ),
  code: (p: React.ComponentProps<'code'>) => <code className="rounded bg-secondary px-1.5 py-0.5 text-[13px] font-mono" {...p} />,
  table: (p: React.ComponentProps<'table'>) => (
    <div className="my-4 overflow-x-auto"><table className="w-full text-sm border border-border rounded-lg overflow-hidden" {...p} /></div>
  ),
  th: (p: React.ComponentProps<'th'>) => <th className="bg-secondary text-left font-semibold px-3 py-2 border-b border-border" {...p} />,
  td: (p: React.ComponentProps<'td'>) => <td className="px-3 py-2 border-b border-border align-top" {...p} />,
}

function LessonView({
  lesson, moduleTitle, isDone, onToggleDone, initialNote, courseSlug, canSave,
}: {
  lesson: Lesson
  moduleTitle: string
  isDone: boolean
  onToggleDone: () => void
  initialNote: string
  courseSlug: string
  canSave: boolean
}) {
  return (
    <article>
      <p className="text-xs font-medium text-muted-foreground mb-1">{moduleTitle}</p>
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{lesson.title}</h2>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-5">
        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lesson.durationMin} min</span>
      </div>

      {lesson.imageUrl && (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border mb-6 bg-secondary">
          <Image src={lesson.imageUrl} alt={lesson.imageAlt ?? lesson.title} fill sizes="(max-width:1024px) 100vw, 640px" className="object-cover" />
        </div>
      )}

      {/* Emplacement vidéo */}
      {lesson.videoUrl ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border mb-6 bg-black">
          <video src={lesson.videoUrl} controls className="w-full h-full" />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-3 mb-6">
          <Video className="w-4 h-4 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">Vidéo de cette leçon à venir prochainement.</p>
        </div>
      )}

      <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
          {lesson.body}
        </ReactMarkdown>
      </div>

      <div className="mt-6">
        <Button onClick={onToggleDone} variant={isDone ? 'outline' : 'default'} size="sm" style={isDone ? undefined : { background: ORANGE }}>
          {isDone ? (<><CheckCircle2 className="w-4 h-4" style={{ color: '#16a34a' }} /> Leçon terminée</>) : 'Marquer comme terminé'}
        </Button>
      </div>

      <NotesPanel lessonId={lesson.id} courseSlug={courseSlug} initial={initialNote} canSave={canSave} />
    </article>
  )
}

function NotesPanel({
  lessonId, courseSlug, initial, canSave,
}: {
  lessonId: string
  courseSlug: string
  initial: string
  canSave: boolean
}) {
  const [value, setValue] = useState(initial)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onChange = (v: string) => {
    setValue(v)
    if (!canSave) return
    setStatus('saving')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        await fetch('/api/client/courses/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseSlug, lessonId, content: v }),
        })
        setStatus('saved')
      } catch {
        setStatus('idle')
      }
    }, 800)
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <NotebookPen className="w-4 h-4" style={{ color: ORANGE }} /> Mes notes
        </p>
        <span className="text-[11px] text-muted-foreground">
          {status === 'saving' ? 'Enregistrement…' : status === 'saved' ? 'Enregistré ✓' : ''}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Notez ici vos idées, vos prompts, vos actions à faire…"
        rows={4}
        className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
      />
    </div>
  )
}

function QuizBlock({ quiz, courseSlug, canSave }: { quiz: Quiz; courseSlug: string; canSave: boolean }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = quiz.questions.reduce((n, q) => (answers[q.id] === q.correctIndex ? n + 1 : n), 0)
  const total = quiz.questions.length
  const pct = total ? Math.round((score / total) * 100) : 0
  const passed = pct >= (quiz.passScore ?? 0)
  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined)

  const submit = async () => {
    setSubmitted(true)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    if (!canSave) return
    try {
      await fetch('/api/client/courses/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug, quizId: quiz.id, score, total,
          answers: quiz.questions.map((q) => answers[q.id] ?? -1),
        }),
      })
    } catch { /* non bloquant */ }
  }

  const reset = () => { setAnswers({}); setSubmitted(false) }

  return (
    <article>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: ORANGE }}>Quiz</p>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-1">{quiz.title}</h2>
      <p className="text-sm text-muted-foreground mb-6">Vérifiez vos acquis — {total} questions.</p>

      {submitted && (
        <div className={`rounded-2xl border p-5 mb-6 ${passed ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
          <p className="text-lg font-bold text-foreground">{passed ? '🎉 Réussi !' : 'Presque !'}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Score : <span className="font-semibold text-foreground">{score}/{total}</span> ({pct}%)
            {!passed && ' — relisez la leçon et réessayez.'}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {quiz.questions.map((q, qi) => (
          <div key={q.id} className="rounded-2xl border border-border bg-card p-4">
            <p className="font-semibold text-foreground mb-3">{qi + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi
                const isCorrect = oi === q.correctIndex
                let cls = 'border-border hover:border-foreground/30'
                if (submitted) {
                  if (isCorrect) cls = 'border-green-400 bg-green-50'
                  else if (selected) cls = 'border-red-300 bg-red-50'
                  else cls = 'border-border opacity-70'
                } else if (selected) {
                  cls = 'bg-secondary'
                }
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className={`w-full text-left flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${cls}`}
                    style={!submitted && selected ? { borderColor: ORANGE } : undefined}
                  >
                    <span
                      className="w-4 h-4 rounded-full border shrink-0 flex items-center justify-center"
                      style={{ borderColor: !submitted && selected ? ORANGE : undefined }}
                    >
                      {!submitted && selected && <span className="w-2 h-2 rounded-full" style={{ background: ORANGE }} />}
                      {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </span>
                    <span className="text-foreground/90">{opt}</span>
                  </button>
                )
              })}
            </div>
            {submitted && (
              <p className="mt-3 text-xs text-muted-foreground bg-secondary/60 rounded-lg px-3 py-2">
                💡 {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        {!submitted ? (
          <Button onClick={submit} disabled={!allAnswered} size="sm" style={{ background: ORANGE }}>
            Valider mes réponses
          </Button>
        ) : (
          <Button onClick={reset} variant="outline" size="sm">Recommencer le quiz</Button>
        )}
      </div>
    </article>
  )
}
