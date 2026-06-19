import type { Course } from './types'
import { formationIa } from './formation-ia'

// Registre des cours disponibles dans le Hub.
// Phase B : ajouter ici seo, video-contenu-ia, visibilite-ia, etc.
export const COURSES: Course[] = [formationIa]

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug)
}

export function getCourses(slugs: string[]): Course[] {
  return COURSES.filter((c) => slugs.includes(c.slug))
}

export * from './types'
