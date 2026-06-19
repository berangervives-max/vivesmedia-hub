import { createClient } from '@/lib/supabase/server'
import { COURSES, getCourse as getCodeCourse } from './index'
import type { Course } from './types'

// Lecture des cours : la table `courses` (Supabase) fait foi ; si elle est vide
// ou indisponible, on retombe sur le contenu du code (lib/courses). Ainsi le site
// fonctionne avant même que l'admin n'ait importé/édité les cours en base.

export async function listCoursesStore(): Promise<Course[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .select('slug, data, position, published')
      .order('position', { ascending: true })
    if (error || !data || data.length === 0) return COURSES
    const rows = data as unknown as { data: Course; published: boolean }[]
    const courses = rows
      .filter((r) => r.published !== false && r.data && (r.data as Course).slug)
      .map((r) => r.data as Course)
    return courses.length ? courses : COURSES
  } catch {
    return COURSES
  }
}

export async function getCourseStore(slug: string): Promise<Course | undefined> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('courses')
      .select('data')
      .eq('slug', slug)
      .maybeSingle()
    const row = data as unknown as { data: Course } | null
    if (row?.data && (row.data as Course).slug) return row.data as Course
  } catch {
    /* fallback code */
  }
  return getCodeCourse(slug)
}
