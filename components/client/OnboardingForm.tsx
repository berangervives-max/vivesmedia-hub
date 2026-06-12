'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FormField, FormFieldType } from '@/types/database'
import { toast } from 'sonner'

interface Props {
  formId: string
  projectId: string
  fields: FormField[]
  existingResponses: Record<string, string | string[]>
}

export default function OnboardingForm({ formId, projectId, fields, existingResponses }: Props) {
  const router = useRouter()
  const [responses, setResponses] = useState<Record<string, string | string[]>>(existingResponses)
  const [loading, setLoading] = useState(false)

  function setValue(fieldId: string, value: string | string[]) {
    setResponses((prev) => ({ ...prev, [fieldId]: value }))
  }

  function toggleMultiselect(fieldId: string, option: string) {
    const current = (responses[fieldId] as string[]) ?? []
    if (current.includes(option)) {
      setValue(fieldId, current.filter((v) => v !== option))
    } else {
      setValue(fieldId, [...current, option])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    for (const field of fields) {
      if (!field.required) continue
      const val = responses[field.id]
      if (!val || (Array.isArray(val) && val.length === 0)) {
        toast.error(`Le champ "${field.label}" est requis.`)
        return
      }
    }

    setLoading(true)
    try {
      const res = await fetch(`/hub/api/client/projects/${projectId}/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId, responses }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Formulaire envoyé !')
      router.push(`/dashboard/${projectId}`)
      router.refresh()
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-zinc-900 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <FieldInput
            field={field}
            value={responses[field.id] ?? ''}
            onChange={(v) => setValue(field.id, v)}
            onToggle={(opt) => toggleMultiselect(field.id, opt)}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-zinc-900 text-white text-sm font-medium py-3 px-6 rounded-xl hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Envoi...' : 'Envoyer le formulaire →'}
      </button>
    </form>
  )
}

function FieldInput({
  field,
  value,
  onChange,
  onToggle,
}: {
  field: FormField
  value: string | string[]
  onChange: (v: string | string[]) => void
  onToggle: (opt: string) => void
}) {
  const inputClass =
    'w-full text-sm text-zinc-900 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent placeholder:text-zinc-400 transition-shadow'

  const type = field.type as FormFieldType

  if (type === 'textarea') {
    return (
      <textarea
        rows={4}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? ''}
        className={`${inputClass} resize-none`}
      />
    )
  }

  if (type === 'select') {
    return (
      <select
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="">Choisir...</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  if (type === 'multiselect') {
    const selected = (value as string[]) ?? []
    return (
      <div className="flex flex-wrap gap-2">
        {field.options?.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`text-sm px-4 py-2 rounded-xl border transition-colors ${
              selected.includes(opt)
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    )
  }

  if (type === 'url') {
    return (
      <input
        type="url"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? 'https://...'}
        className={inputClass}
      />
    )
  }

  if (type === 'file') {
    return (
      <div>
        <input
          type="url"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Collez l'URL de votre fichier (Google Drive, Dropbox...)"
          className={inputClass}
        />
        <p className="text-xs text-zinc-400 mt-1">
          Partagez votre fichier via Google Drive, Dropbox ou WeTransfer et collez le lien ici.
        </p>
      </div>
    )
  }

  return (
    <input
      type="text"
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder ?? ''}
      className={inputClass}
    />
  )
}
