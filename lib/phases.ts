import type { ProjectPhase } from '@/types/database'
import { PHASE_LABELS, PHASE_ORDER } from '@/types/database'

export { PHASE_LABELS, PHASE_ORDER }

/**
 * Source unique pour l'affichage des phases de projet dans tout le Hub.
 * Les couleurs vivent dans globals.css (`.phase-badge[data-phase="…"]`) : ici,
 * uniquement le texte et les calculs. Fini les maps de couleurs dupliquées par page.
 */

export const PHASE_DESCRIPTIONS: Record<ProjectPhase, string> = {
  onboarding: 'Nous recueillons vos informations pour démarrer',
  design: "Création des maquettes et de l'identité visuelle",
  dev: 'Développement technique de votre site',
  recette: 'Tests et vérifications avant la mise en ligne',
  livraison: 'Votre site est en ligne, félicitations',
  maintenance: 'Suivi, mises à jour et support technique',
}

/** Accroche courte en serif, ton chaleureux, une par phase (accent éditorial). */
export const PHASE_TAGLINES: Record<ProjectPhase, string> = {
  onboarding: 'On fait connaissance.',
  design: 'On dessine votre univers.',
  dev: 'Votre site prend forme.',
  recette: 'On peaufine les derniers détails.',
  livraison: 'Votre site est en ligne.',
  maintenance: 'On veille sur votre site.',
}

/** Version courte, pour les en-têtes admin. */
export const PHASE_SHORT: Record<ProjectPhase, string> = {
  onboarding: 'Onboarding',
  design: 'Design',
  dev: 'Dév.',
  recette: 'Recette',
  livraison: 'Livraison',
  maintenance: 'Suivi',
}

/** Index de la phase dans le parcours (0 à 5). */
export function phaseIndex(phase: ProjectPhase): number {
  return PHASE_ORDER.indexOf(phase)
}

/** Avancement global en pourcentage (0 à 100), basé sur la position de la phase. */
export function phaseProgress(phase: ProjectPhase): number {
  return Math.round(((phaseIndex(phase) + 1) / PHASE_ORDER.length) * 100)
}

/** Libellé lisible de la phase. */
export function phaseLabel(phase: ProjectPhase): string {
  return PHASE_LABELS[phase]
}
