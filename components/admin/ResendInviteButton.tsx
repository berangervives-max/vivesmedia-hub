'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Send, Check } from 'lucide-react'

export default function ResendInviteButton({
  email,
  clientName,
  clientId,
}: {
  email: string
  clientName: string
  clientId?: string
}) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleResend() {
    if (!clientId) return
    setLoading(true)
    try {
      const res = await fetch(`/hub/api/admin/clients/${clientId}/invite`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error()
      setSent(true)
      toast.success(`Invitation renvoyée à ${email}`)
    } catch {
      toast.error("Erreur lors de l'envoi. Vérifiez la clé Resend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleResend}
      disabled={loading || sent}
      className="flex items-center gap-2 text-sm font-medium border border-zinc-200 text-zinc-700 px-4 py-2 rounded-xl hover:bg-zinc-50 disabled:opacity-60 transition-colors"
    >
      {sent ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          Invitation envoyée
        </>
      ) : (
        <>
          <Send className="w-4 h-4" />
          {loading ? 'Envoi…' : 'Renvoyer l\'invitation'}
        </>
      )}
    </button>
  )
}
