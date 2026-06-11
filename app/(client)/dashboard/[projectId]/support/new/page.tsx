'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { TicketPriority } from '@/types/database'

const PRIORITY_OPTIONS: { value: TicketPriority; label: string; description: string }[] = [
  { value: 'low', label: 'Faible', description: 'Pas urgent, peut attendre quelques jours' },
  { value: 'medium', label: 'Moyen', description: 'À traiter dans les 48h' },
  { value: 'high', label: 'Urgent', description: 'Bloque mon activité — intervention rapide requise' },
]

const inputClass =
  'w-full text-sm text-zinc-900 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent placeholder:text-zinc-400 transition-shadow'

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
      const res = await fetch(`/api/client/projects/${projectId}/tickets`, {
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

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          href={`/dashboard/${projectId}`}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au projet
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">Nouveau ticket de support</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Décrivez votre demande avec le plus de détails possible pour accélérer la résolution.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Le support est disponible dans le cadre de votre contrat de maintenance.
            Délai de réponse habituel : <strong>24-48h ouvrées</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1.5">
              Titre du problème <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : La page contact ne s'affiche pas correctement"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1.5">
              Description détaillée <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le problème en détail : ce que vous avez fait, ce que vous voyez, ce qui était attendu, les étapes pour reproduire..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Niveau d'urgence
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    priority === opt.value
                      ? opt.value === 'high'
                        ? 'border-red-500 bg-red-50'
                        : opt.value === 'medium'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-zinc-400 bg-zinc-50'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <p className={`text-sm font-semibold ${
                    priority === opt.value
                      ? opt.value === 'high' ? 'text-red-700' : opt.value === 'medium' ? 'text-yellow-700' : 'text-zinc-900'
                      : 'text-zinc-600'
                  }`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-tight">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 text-white text-sm font-medium py-3 px-6 rounded-xl hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Envoi...' : 'Envoyer le ticket →'}
          </button>
        </form>
      </div>
    </div>
  )
}
