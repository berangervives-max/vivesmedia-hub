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
        const res = await fetch(`/hub/api/admin/projects/${projectId}/form`)
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
      const res = await fetch(`/hub/api/admin/projects/${projectId}/form`, {
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
      const res = await fetch(`/hub/api/admin/projects/${projectId}/form`, { method: 'DELETE' })
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
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href={`/admin/projects/${projectId}`}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au projet
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
            Formulaire d'onboarding
          </p>
          <h1 className="text-2xl font-bold text-foreground">Éditeur de formulaire</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ce formulaire sera envoyé au client pour récupérer les informations de démarrage.
          </p>
        </div>
        {formId && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Supprimer
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Titre */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-2">
            Titre du formulaire
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm bg-secondary rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none border border-transparent focus:border-border transition-colors"
          />
        </div>

        {/* Champs */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.12em]">
              Champs ({fields.length})
            </label>
            <button
              type="button"
              onClick={addField}
              className="flex items-center gap-1.5 text-xs text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-all"
              style={{ backgroundColor: '#F4521E' }}
            >
              <Plus className="w-3 h-3" />
              Ajouter un champ
            </button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 bg-secondary/50 rounded-xl border-2 border-dashed border-border">
              <p className="text-sm text-muted-foreground">Aucun champ. Cliquez sur &quot;Ajouter un champ&quot; pour commencer.</p>
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

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full text-white text-sm font-semibold py-3 rounded-full hover:opacity-90 disabled:opacity-50 transition-all"
          style={{ backgroundColor: '#F4521E' }}
        >
          {loading ? 'Sauvegarde...' : formId ? 'Mettre à jour le formulaire' : 'Créer le formulaire'}
        </button>
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
    <div className="bg-secondary/40 border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
        <span className="text-xs font-medium text-muted-foreground w-5">{index + 1}</span>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Label du champ"
            className="text-sm text-foreground bg-card border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-foreground/20 transition-colors"
          />
          <select
            value={field.type}
            onChange={(e) => onUpdate({ type: e.target.value as FormFieldType })}
            className="text-sm text-foreground bg-card border border-border rounded-lg px-3 py-1.5 focus:outline-none"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded accent-orange-500"
          />
          Requis
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground/40 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <input
        type="text"
        value={field.placeholder ?? ''}
        onChange={(e) => onUpdate({ placeholder: e.target.value })}
        placeholder="Placeholder (optionnel)"
        className="w-full text-sm text-foreground bg-card border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-foreground/20 ml-7 transition-colors"
      />

      {needsOptions && (
        <div className="ml-7">
          <label className="block text-xs text-muted-foreground mb-1">
            Options (une par ligne)
          </label>
          <textarea
            rows={3}
            value={field.options?.join('\n') ?? ''}
            onChange={(e) => onOptionsChange(e.target.value)}
            placeholder={'Option 1\nOption 2\nOption 3'}
            className="w-full text-sm text-foreground bg-card border border-border rounded-lg px-3 py-2 focus:outline-none resize-none"
          />
        </div>
      )}
    </div>
  )
}
