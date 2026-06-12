'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { PHASE_LABELS, PHASE_ORDER } from '@/types/database'
import type { ProjectPhase } from '@/types/database'

export default function PhaseSelector({
  projectId,
  currentPhase,
  clientEmail,
  clientName,
  projectName,
}: {
  projectId: string
  currentPhase: ProjectPhase
  clientEmail: string
  clientName: string
  projectName: string
}) {
  const [selected, setSelected] = useState<ProjectPhase>(currentPhase)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const hasChanged = selected !== currentPhase

  async function handleUpdate() {
    if (!hasChanged) return
    setLoading(true)

    try {
      const res = await fetch(`/hub/api/admin/projects/${projectId}/phase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: selected, note }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')

      toast.success(`Projet passé en phase ${PHASE_LABELS[selected]}`)
      setNote('')
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-2">
          <Label className="text-xs text-zinc-500">Changer la phase</Label>
          <Select value={selected} onValueChange={(v) => setSelected(v as ProjectPhase)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PHASE_ORDER.map((phase) => (
                <SelectItem key={phase} value={phase}>
                  {PHASE_LABELS[phase]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <Label className="text-xs text-zinc-500">Note (optionnel)</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Message pour le client…"
            className="h-9"
          />
        </div>
        <Button
          onClick={handleUpdate}
          disabled={!hasChanged || loading}
          size="sm"
          className="h-9"
        >
          {loading ? 'Mise à jour…' : 'Valider →'}
        </Button>
      </div>
      {hasChanged && (
        <p className="text-xs text-zinc-400">
          Un email sera envoyé à {clientEmail} pour notifier le changement.
        </p>
      )}
    </div>
  )
}
