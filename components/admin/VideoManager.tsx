'use client'

import { useState } from 'react'
import { Plus, Trash2, Play, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type VideoRow = Database['public']['Tables']['training_videos']['Row']

interface Props {
  projectId: string
  initialVideos: VideoRow[]
}

const inputClass =
  'w-full text-sm text-zinc-900 bg-white border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 placeholder:text-zinc-400'

export default function VideoManager({ projectId, initialVideos }: Props) {
  const [videos, setVideos] = useState<VideoRow[]>(initialVideos)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !url.trim()) {
      toast.error('Titre et URL requis.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/hub/api/admin/projects/${projectId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, url }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setVideos((prev) => [...prev, data.video])
      setTitle('')
      setDescription('')
      setUrl('')
      setShowForm(false)
      toast.success('Vidéo ajoutée.')
    } catch {
      toast.error('Erreur lors de l\'ajout.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(videoId: string, videoTitle: string) {
    if (!confirm(`Supprimer "${videoTitle}" ?`)) return
    try {
      const res = await fetch(`/hub/api/admin/projects/${projectId}/videos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      })
      if (!res.ok) throw new Error(await res.text())
      setVideos((prev) => prev.filter((v) => v.id !== videoId))
      toast.success('Vidéo supprimée.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  return (
    <div className="space-y-4">
      {videos.length === 0 && !showForm && (
        <p className="text-sm text-zinc-400 text-center py-4">Aucune vidéo de formation.</p>
      )}

      {videos.length > 0 && (
        <div className="space-y-2">
          {videos.map((video, index) => (
            <div key={video.id} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                <Play className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-mono">{index + 1}.</span>
                  <p className="text-sm font-medium text-zinc-900 truncate">{video.title}</p>
                </div>
                {video.description && (
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{video.description}</p>
                )}
              </div>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-zinc-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => handleDelete(video.id, video.title)}
                className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleAdd} className="bg-zinc-50 rounded-xl p-4 space-y-3 border border-zinc-200">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la vidéo *"
            className={inputClass}
            autoFocus
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description courte (optionnel)"
            className={inputClass}
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL de la vidéo (YouTube, Loom, Vimeo...) *"
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 text-sm font-medium bg-zinc-900 text-white py-2 rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Ajout...' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setTitle(''); setDescription(''); setUrl('') }}
              className="px-4 text-sm text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter une vidéo
        </button>
      )}
    </div>
  )
}
