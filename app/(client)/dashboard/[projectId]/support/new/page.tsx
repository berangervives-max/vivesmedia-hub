'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Clock } from 'lucide-react'
import { toast } from 'sonner'
import type { TicketPriority } from '@/types/database'

const PRIORITY_OPTIONS: {
  value: TicketPriority
  label: string
  description: string
  active: string
  activeText: string
}[] = [
  { value: 'low', label: 'Faible', description: 'Peut attendre quelques jours', active: 'border-emerald-300 bg-emerald-50', activeText: 'text-emerald-700' },
  { value: 'medium', label: 'Moyen', description: 'À traiter dans les 48h', active: 'border-amber-300 bg-amber-50', activeText: 'text-amber-700' },
  { value: 'high', label: 'Urgent', description: 'Bloque mon activité', active: 'border-red-300 bg-red-50', activeText: 'text-red-700' },
]

export default function NewTicketPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast.error('Merci de remplir tous les champs.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/hub/api/client/projects/${projectId}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Ticket créé ! Nous vous répondons sous 24-48h.')
      router.push(`/dashboard/${projectId}`)
      router.refresh()
    } catch {
      toast.error('Erreur lors de la création du ticket.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full text-sm bg-card rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-colors'

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href={`/dashboard/${projectId}`}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au projet
      </Link>

      <p className="hub-eyebrow">Support</p>
      <h1 className="text-2xl font-bold text-foreground mt-1.5 mb-2">
        Nouveau <span className="hub-accent">ticket</span>
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Décrivez votre demande avec le plus de détails possible pour accélérer la résolution.
      </p>

      {/* Bandeau info */}
      <div className="flex items-start gap-3 hub-card p-4 mb-6">
        <Clock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <p className="text-sm text-muted-foreground">
          Support disponible dans le cadre de votre contrat de maintenance.
          Délai de réponse habituel : <strong className="text-foreground">24-48h ouvrées</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Titre */}
        <div className="hub-card p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Titre du problème <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : La page contact ne s'affiche pas correctement"
            required
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div className="hub-card p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Description détaillée <span className="text-primary">*</span>
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le problème : ce que vous avez fait, ce que vous voyez, ce qui était attendu, comment reproduire…"
            required
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Priorité */}
        <div className="hub-card p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">Niveau d&apos;urgence</label>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITY_OPTIONS.map((opt) => {
              const isActive = priority === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive ? opt.active : 'border-border bg-secondary/50 hover:border-muted-foreground/30'
                  }`}
                >
                  <p className={`text-sm font-semibold ${isActive ? opt.activeText : 'text-foreground'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{opt.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="hub-btn hub-btn-primary w-full py-3 disabled:opacity-50"
        >
          {loading ? 'Envoi…' : <>Envoyer le ticket <ArrowUpRight className="w-4 h-4" /></>}
        </button>
      </form>
    </div>
  )
}
