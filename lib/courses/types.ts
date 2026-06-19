// Types du contenu pédagogique des cours (le contenu vit dans le code,
// l'état par utilisateur — progression, notes, quiz — vit dans Supabase).

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  /** index de la bonne réponse dans options */
  correctIndex: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  /** score mini (sur 100) pour considérer le quiz réussi */
  passScore?: number
  questions: QuizQuestion[]
}

export interface Lesson {
  id: string
  title: string
  durationMin: number
  /** corps de la leçon en Markdown */
  body: string
  imageUrl?: string
  imageAlt?: string
  /** URL d'une vraie vidéo si déjà enregistrée ; sinon null → emplacement affiché */
  videoUrl?: string | null
  /** script de tournage (interne / aide à l'enregistrement) */
  videoScript?: string
}

export interface CourseModule {
  id: string
  title: string
  summary: string
  lessons: Lesson[]
  quiz?: Quiz
}

export interface Course {
  slug: string
  title: string
  tagline: string
  level: string
  durationLabel: string
  audience: string
  coverImageUrl?: string
  /** objectifs pédagogiques (compétences visées) */
  outcomes: string[]
  /** ce que le client repart avec */
  deliverables: string[]
  modules: CourseModule[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function allLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons)
}

export function lessonCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.lessons.length, 0)
}

export function totalDuration(course: Course): number {
  return allLessons(course).reduce((n, l) => n + l.durationMin, 0)
}

export function progressPercent(course: Course, completedLessonIds: Set<string>): number {
  const total = lessonCount(course)
  if (total === 0) return 0
  const done = allLessons(course).filter((l) => completedLessonIds.has(l.id)).length
  return Math.round((done / total) * 100)
}
