import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { COURSES, getCourses, lessonCount } from '@/lib/courses'
import { GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata = { title: 'Mes formations — vivesmedia.com' }

export default async function FormationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Client courant
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  // Cours auxquels le client a accès (admin = tout)
  let enrolledSlugs: string[] = []
  if (client) {
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('course_slug')
      .eq('client_id', client.id)
    enrolledSlugs = (enrollments ?? []).map((e) => e.course_slug)
  }

  const courses = isAdmin ? COURSES : getCourses(enrolledSlugs)

  // Progression par cours
  const completedByCourse = new Map<string, Set<string>>()
  if (client && courses.length > 0) {
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('course_slug, lesson_id')
      .eq('client_id', client.id)
    for (const row of progress ?? []) {
      if (!completedByCourse.has(row.course_slug)) completedByCourse.set(row.course_slug, new Set())
      completedByCourse.get(row.course_slug)!.add(row.lesson_id)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#F4521E' }}>
          Espace formation
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mes formations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vos parcours et ressources, accessibles à vie après achat.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground mb-1">Aucune formation pour le moment</p>
          <p className="text-sm text-muted-foreground">
            Vos formations apparaîtront ici dès qu'un accès vous sera attribué.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {courses.map((course) => {
            const done = completedByCourse.get(course.slug)?.size ?? 0
            const total = lessonCount(course)
            const pct = total ? Math.round((done / total) * 100) : 0
            const finished = total > 0 && done >= total
            return (
              <Link
                key={course.slug}
                href={`/dashboard/formations/${course.slug}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative aspect-video bg-secondary">
                  {course.coverImageUrl && (
                    <Image
                      src={course.coverImageUrl}
                      alt={course.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  )}
                  {finished && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-green-600 text-white text-[11px] font-semibold px-2.5 py-1">
                      <CheckCircle2 className="w-3 h-3" /> Terminé
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-bold text-foreground leading-tight">{course.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">{course.tagline}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>{done}/{total} leçons</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: '#F4521E' }} />
                    </div>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#F4521E' }}>
                    {pct > 0 ? 'Reprendre' : 'Commencer'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
