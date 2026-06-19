import type { Course } from './types'
import { formationIa } from './formation-ia'
import { seo } from './seo'
import { siteVitrine } from './site-vitrine'
import { siteCatalogue } from './site-catalogue'
import { siteEcommerce } from './site-ecommerce'
import { videoContenuIa } from './video-contenu-ia'
import { visibiliteIa } from './visibilite-ia'
import { crmAutomatisation } from './crm-automatisation'
import { maintenance } from './maintenance'

// Registre des cours disponibles dans le Hub (1 par service vendu).
export const COURSES: Course[] = [
  formationIa,
  seo,
  siteVitrine,
  siteCatalogue,
  siteEcommerce,
  videoContenuIa,
  visibiliteIa,
  crmAutomatisation,
  maintenance,
]

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug)
}

export function getCourses(slugs: string[]): Course[] {
  return COURSES.filter((c) => slugs.includes(c.slug))
}

export * from './types'
