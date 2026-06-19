import CourseEditor from '@/components/admin/CourseEditor'
import type { Course } from '@/lib/courses/types'

export const metadata = { title: 'Nouveau cours — Hub Admin' }

const EMPTY: Course = {
  slug: '',
  title: '',
  tagline: '',
  level: 'Débutant',
  durationLabel: '',
  audience: '',
  coverImageUrl: '',
  outcomes: [],
  deliverables: [],
  modules: [],
}

export default function NewCoursePage() {
  return <CourseEditor initial={EMPTY} isNew />
}
