'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import type { FormField, FormFieldType } from '@/types/database'

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Texte court' },
  { value: 'textarea', label: 'Texte long' },
  { value: 'select', label: 'Liste déroulante (un seul choix)' },
  { value: 'multiselect', label: 'Choix multiples' },
  { value: 'url', label: 'URL / Lien' },
  { value: 'file', label: 'Fichier (lien de partage)' },
]

const inputClass =
  'w-full text-sm text-zinc-900 bg-white border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent placeholder:text-zinc-400'

export default function FormBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [formId, setFormId] = useState<string | null>(null)
  const [title, setTitle] = useState('Formulaire de démarrage')
  const [fields, setFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/projects/${projectId}/form`)
        if (res.ok) {
          const data = await res.json()
          if (data.form) {
            setFormId(data.form.id)
            setTitle(data.form.title)
            setFields(data.form.fields ?? [])
          }
        }
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [projectId])

  function addField() {
    setFields((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: 'text', label: 'Nouveau champ', required: false },
    ])
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }

  function updateField(id: string, patch: Partial<FormField>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  function updateOptions(id: string, raw: string) {
    const options = raw.split('\n').map((s) => s.trim()).filter(Boolean)
    updateField(id, { options })
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error('Le titre est requis.')
      return
    }
    setLoading(true)
    try {
      const method = formId ? 'PUT' : 'POST'
      const res = await fetch(`/api/admin/projects/${projectId}/form`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: formId, title, fields }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (!formId) setFormId(data.form.id)
      toast.success('Formulaire sauvegardé !')
    } catch {
      toast.error('Erreur lors de la sauvegarde.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!formId) return
    if (!confirm('Supprimer le formulaire et toutes les réponses ?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/form`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Formulaire supprimé.')
      router.push(`/admin/projects/${projectId}`)
    } catch {
      toast.error('Erreur lors de la suppression.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <p className="text-sm text-zinc-400">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href={`/admin/projects/${projectId}`}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au projet
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Formulaire d'onboarding</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Ce formulaire sera envoyé au client pour récupérer les informations de démarrage.
          </p>
        </div>
        {formId && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Supprimer le formulaire
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Titre du formulaire
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Champs ({fields.length})
            </label>
            <button
              type="button"
              onClick={addField}
              className="flex items-center gap-1.5 text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Ajouter un champ
            </button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
              <p className="text-sm text-zinc-400">Aucun champ. Cliquez sur "Ajouter un champ" pour commencer.</p>
            </div>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <FieldEditor
                key={field.id}
                field={field}
                index={index}
                onUpdate={(patch) => updateField(field.id, patch)}
                onRemove={() => removeField(field.id)}
                onOptionsChange={(raw) => updateOptions(field.id, raw)}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-zinc-100">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-zinc-900 text-white text-sm font-medium py-2.5 px-6 rounded-xl hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sauvegarde...' : formId ? 'Mettre à jour' : 'Créer le formulaire'}
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldEditor({
  field,
  index,
  onUpdate,
  onRemove,
  onOptionsChange,
}: {
  field: FormField
  index: number
  onUpdate: (patch: Partial<FormField>) => void
  onRemove: () => void
  onOptionsChange: (raw: string) => void
}) {
  const needsOptions = field.type === 'select' || field.type === 'multiselect'

  return (
    <div className="bg-white border border-zinc-100 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <GripVertical className="w-4 h-4 text-zinc-300 shrink-0" />
        <span className="text-xs font-medium text-zinc-400 w-5">{index + 1}</span>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Label du champ"
            className="text-sm text-zinc-900 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
          />
          <select
            value={field.type}
            onChange={(e) => onUpdate({ type: e.target.value as FormFieldType })}
            className="text-sm text-zinc-900 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-zinc-500 shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded"
          />
          Requis
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="text-zinc-300 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <input
        type="text"
        value={field.placeholder ?? ''}
        onChange={(e) => onUpdate({ placeholder: e.target.value })}
        placeholder="Placeholder (optionnel)"
        className="w-full text-sm text-zinc-900 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 ml-7"
      />

      {needsOptions && (
        <div className="ml-7">
          <label className="block text-xs text-zinc-400 mb-1">
            Options (une par ligne)
          </label>
          <textarea
            rows={3}
            value={field.options?.join('\n') ?? ''}
            onChange={(e) => onOptionsChange(e.target.value)}
            placeholder={'Option 1\nOption 2\nOption 3'}
            className="w-full text-sm text-zinc-900 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
          />
        </div>
      )}
    </div>
  )
}
