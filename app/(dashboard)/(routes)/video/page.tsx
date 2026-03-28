'use client'

import { Video, Loader, Trash2, Play } from "lucide-react"
import { useState } from "react"
import axios from "axios"

type VideoItem = {
  prompt: string
  url: string
}

export default function VideoPage() {
  const [prompt, setPrompt] = useState('')
  const [history, setHistory] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    try {
      setLoading(true)

      const response = await axios.post('/api/video', { prompt })
      const url = response.data.video
if (!url) throw new Error("No video URL returned")
setHistory(prev => [{ prompt, url }, ...prev])
      setPrompt('')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => setHistory([])

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <Video className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Video Generation
            </h1>
            <p className="text-sm text-gray-500">
              Generate short AI videos from a text prompt.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
          placeholder="e.g. A futuristic city with flying cars at night..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-orange-700 transition"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-10 gap-3">
          <Loader className="animate-spin text-orange-500 w-8 h-8" />
          <p className="text-sm text-gray-400">
            Rendering your video, this may take 30–60 seconds...
          </p>
          {/* Fake progress bar for UX */}
          <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
            <Play className="w-8 h-8 text-orange-300" />
          </div>
          <p className="text-sm">No videos generated yet. Try a prompt above ☝️</p>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {history.map((item, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group"
          >
            {/* Video Player */}
            <div className="relative bg-black aspect-video">
             {item.url ? (
  <video
    src={item.url}
    controls
    className="w-full h-full object-contain"
    preload="metadata"
  />
) : (
  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
    Video unavailable
  </div>
)}
            </div>

            {/* Prompt Label */}
            <div className="p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prompt</p>
              <p className="text-sm text-gray-800 mt-0.5 line-clamp-2">{item.prompt}</p>

              {/* Download link */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-block mt-2 text-xs text-orange-600 hover:underline"
              >
                Download Video ↓
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}