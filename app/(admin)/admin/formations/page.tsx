import { createClient } from '@/lib/supabase/server'
import { COURSES } from '@/lib/courses'
import type { Course } from '@/lib/courses/types'
import { lessonCount } from '@/lib/courses/types'
import FormationsManager from '@/components/admin/FormationsManager'

export const metadata = { title: 'Formations — Hub Admin' }
export const dynamic = 'force-dynamic'

export type CourseListItem = {
  slug: string
  title: string
  tagline: string
  level: string
  published: boolean
  modules: number
  lessons: number
}

export default async function AdminFormationsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('slug, data, published, position')
    .order('position', { ascending: true })

  const rows = (data ?? []) as unknown as { slug: string; data: Course; published: boolean }[]

  const items: CourseListItem[] = rows
    .filter((r) => r.data && (r.data as Course).slug)
    .map((r) => ({
      slug: r.slug,
      title: r.data.title,
      tagline: r.data.tagline,
      level: r.data.level,
      published: r.published,
      modules: r.data.modules?.length ?? 0,
      lessons: lessonCount(r.data),
    }))

  const codeCount = COURSES.length
  const inDb = new Set(items.map((i) => i.slug))
  const missingFromDb = COURSES.filter((c) => !inDb.has(c.slug)).length

  return (
    <FormationsManager initialItems={items} codeCount={codeCount} missingFromDb={missingFromDb} />
  )
}
