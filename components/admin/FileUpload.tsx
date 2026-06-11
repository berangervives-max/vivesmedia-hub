'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, Image, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import type { FileCategory } from '@/types/database'
import type { Database } from '@/types/database'

type FileRow = Database['public']['Tables']['files']['Row']

interface Props {
  projectId: string
  initialFiles: FileRow[]
}

const CATEGORY_OPTIONS: { value: FileCategory; label: string; Icon: React.ElementType }[] = [
  { value: 'file', label: 'Document', Icon: FileText },
  { value: 'maquette', label: 'Maquette', Icon: Image },
  { value: 'invoice', label: 'Facture', Icon: Receipt },
]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export default function FileUpload({ projectId, initialFiles }: Props) {
  const [files, setFiles] = useState<FileRow[]>(initialFiles)
  const [category, setCategory] = useState<FileCategory>('file')
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/files`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setFiles((prev) => [data.file, ...prev])
      toast.success(`"${file.name}" déposé et le client notifié.`)
    } catch {
      toast.error('Erreur lors du téléversement.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDelete(fileId: string, fileName: string) {
    if (!confirm(`Supprimer "${fileName}" ?`)) return
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/files`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      })
      if (!res.ok) throw new Error(await res.text())
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
      toast.success('Fichier supprimé.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as FileCategory)}
            className="text-sm text-zinc-900 bg-white border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <label className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl cursor-pointer transition-colors ${
          uploading ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-zinc-900 text-white hover:bg-zinc-700'
        }`}>
          <Upload className="w-4 h-4" />
          {uploading ? 'Téléversement...' : 'Déposer un fichier'}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-6">Aucun fichier déposé.</p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const opt = CATEGORY_OPTIONS.find((c) => c.value === file.category)
            const Icon = opt?.Icon ?? FileText
            return (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl group">
                <div className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{file.name}</p>
                  <p className="text-xs text-zinc-400">
                    {opt?.label} · {file.size_bytes ? formatBytes(file.size_bytes) : '—'} ·{' '}
                    {new Date(file.uploaded_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(file.id, file.name)}
                  className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
