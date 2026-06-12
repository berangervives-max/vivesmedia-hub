'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react'
import type { ProjectPhase } from '@/types/database'
import { PHASE_LABELS } from '@/types/database'

const PROJECT_TYPES = [
  { value: 'ecommerce-shopify', label: 'E-commerce Shopify' },
  { value: 'site-vitrine', label: 'Site vitrine' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'refonte', label: 'Refonte' },
]

const LEVELS = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
]

const PHASES: ProjectPhase[] = ['onboarding', 'design', 'dev', 'recette', 'livraison', 'maintenance']

const QUICK_SUBJECTS = [
  'Tour du Hub Client',
  'Prise en main Shopify Admin',
  'Ajouter et gérer des produits',
  'Traiter les commandes',
  'Comprendre les statistiques',
  'Valider les maquettes',
  'Créer un ticket de support',
  'SEO de base pour sa boutique',
]

export default function FormationGenerator({ projectId }: { projectId: string }) {
  const [subject, setSubject] = useState('')
  const [phase, setPhase] = useState<ProjectPhase>('livraison')
  const [projectType, setProjectType] = useState('ecommerce-shopify')
  const [clientSector, setClientSector] = useState('')
  const [level, setLevel] = useState<'debutant' | 'intermediaire'>('debutant')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!subject.trim()) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/hub/api/admin/ai/formation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, phase, projectType, clientSector: clientSector || undefined, level }),
      })
      const data = await res.json()
      setResult(data.content ?? 'Erreur lors de la génération.')
    } catch {
      setResult('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(244,82,30,0.1)' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#F4521E' }} />
          </div>
          <p className="text-sm font-semibold text-foreground">Générateur de module IA</p>
        </div>

        <div className="space-y-4">
          {/* Quick subjects */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Sujets rapides</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    subject === s
                      ? 'text-white border-transparent'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                  style={subject === s ? { backgroundColor: '#F4521E', borderColor: '#F4521E' } : {}}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Subject input */}
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Sujet personnalisé</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex : Configurer les frais de livraison Shopify"
              className="w-full text-sm bg-secondary rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none border border-transparent focus:border-border transition-colors"
            />
          </div>

          {/* Phase + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Phase client</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as ProjectPhase)}
                className="w-full text-sm bg-secondary rounded-xl px-3 py-2.5 text-foreground focus:outline-none border border-transparent"
              >
                {PHASES.map((p) => (
                  <option key={p} value={p}>{PHASE_LABELS[p]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Type de projet</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full text-sm bg-secondary rounded-xl px-3 py-2.5 text-foreground focus:outline-none border border-transparent"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sector + Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Secteur client (optionnel)</label>
              <input
                type="text"
                value={clientSector}
                onChange={(e) => setClientSector(e.target.value)}
                placeholder="Ex : restauration, mode..."
                className="w-full text-sm bg-secondary rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none border border-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Niveau</label>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value as 'debutant' | 'intermediaire')}
                    className={`flex-1 text-xs py-2.5 rounded-xl border transition-colors font-medium ${
                      level === l.value
                        ? 'text-white border-transparent'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                    style={level === l.value ? { backgroundColor: '#F4521E' } : {}}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || !subject.trim()}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white py-3 rounded-full hover:opacity-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: '#F4521E' }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Génération en cours…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Générer le module</>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Module généré</p>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <div className="p-5">
            <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">
              {result}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
