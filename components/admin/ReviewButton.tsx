'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  projectId: string
}

export default function ReviewButton({ projectId }: Props) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleClick() {
    if (!confirm('Envoyer un email de demande d\'avis Google à ce client ?')) return

    setLoading(true)
    try {
      const res = await fetch(`/hub/api/admin/projects/${projectId}/review`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      setSent(true)
      toast.success('Email d\'avis Google envoyé au client !')
    } catch {
      toast.error('Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || sent}
      className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
        sent
          ? 'bg-green-100 text-green-700 cursor-default'
          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
      }`}
    >
      <Star className="w-4 h-4" />
      {sent ? 'Avis envoyé ✓' : loading ? 'Envoi...' : 'Demander un avis Google'}
    </button>
  )
}
