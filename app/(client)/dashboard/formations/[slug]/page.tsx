import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCourse } from '@/lib/courses'
import { ArrowLeft, Lock } from 'lucide-react'
import CoursePlayer from './CoursePlayer'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  return { title: course ? `${course.title} — Formation` : 'Formation' }
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  // Vérifie l'accès (admin = accès total)
  let hasAccess = isAdmin
  if (!hasAccess && client) {
    const { data: enrollment } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('client_id', client.id)
      .eq('course_slug', slug)
      .maybeSingle()
    hasAccess = !!enrollment
  }

  if (!hasAccess) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Accès non activé</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Cette formation n'est pas encore associée à votre compte. Elle s'active après achat.
        </p>
        <Link href="/dashboard/formations" className="text-sm font-semibold" style={{ color: '#F4521E' }}>
          ← Retour à mes formations
        </Link>
      </div>
    )
  }

  // État du client : leçons terminées + notes
  let completedLessonIds: string[] = []
  const notes: Record<string, string> = {}
  if (client) {
    const [{ data: progress }, { data: noteRows }] = await Promise.all([
      supabase.from('lesson_progress').select('lesson_id').eq('client_id', client.id).eq('course_slug', slug),
      supabase.from('course_notes').select('lesson_id, content').eq('client_id', client.id).eq('course_slug', slug),
    ])
    completedLessonIds = (progress ?? []).map((p) => p.lesson_id)
    for (const n of noteRows ?? []) notes[n.lesson_id] = n.content
  }

  return (
    <div>
      <Link
        href="/dashboard/formations"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Mes formations
      </Link>
      <CoursePlayer
        course={course}
        initialCompleted={completedLessonIds}
        initialNotes={notes}
        canSave={!!client}
      />
    </div>
  )
}
