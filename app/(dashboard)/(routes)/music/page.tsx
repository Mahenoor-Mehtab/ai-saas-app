'use client'

import { Music, Loader, Trash2, Play, Pause, Volume2 } from "lucide-react"
import { useState, useRef } from "react"
import axios from "axios"

export default function MusicPage() {
  const [prompt, setPrompt] = useState('')
  const [musicUrl, setMusicUrl] = useState<string | null>(null)
  const [history, setHistory] = useState<{ prompt: string; url: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    try {
      setLoading(true)
      setMusicUrl(null)

      const response = await axios.post('/api/music', { prompt })
      console.log("API response:", response.data) // ✅ log full response for debugging
    const url = response.data.audio
if (!url) throw new Error("No audio URL returned")
setMusicUrl(url)
setHistory(prev => [{ prompt, url }, ...prev])
      setPrompt('')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

 const togglePlay = (index: number) => {
  const audio = audioRefs.current[index]
  if (!audio || !audio.src) return   // ✅ guard empty src

  if (playingIndex === index) {
    audio.pause()
    setPlayingIndex(null)
  } else {
    audioRefs.current.forEach((a, i) => {
      if (a && i !== index) a.pause()
    })

    audio.play()                     // ✅ handle promise
      .then(() => {
        setPlayingIndex(index)
      })
      .catch((err) => {
        console.error("Playback failed:", err)
        setPlayingIndex(null)        // ✅ reset if fails
      })
  }
}

  const handleClear = () => {
    setHistory([])
    setMusicUrl(null)
    setPlayingIndex(null)
  }

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Music className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Music Generation
            </h1>
            <p className="text-sm text-gray-500">
              Generate original music tracks from a text prompt using AI.
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
          placeholder="e.g. Upbeat lo-fi hip hop with soft piano..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-purple-700 transition"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-10 gap-3">
          <Loader className="animate-spin text-purple-500 w-8 h-8" />
          <p className="text-sm text-gray-400">Composing your track, this may take a moment...</p>
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <Volume2 className="w-10 h-10 text-gray-300" />
          <p className="text-sm">No music generated yet. Try a prompt above ☝️</p>
        </div>
      )}

      {/* Music History */}
      <div className="space-y-4">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-purple-50 transition group"
          >
            {/* Play/Pause Button */}
            <button
              onClick={() => togglePlay(index)}
              className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white flex-shrink-0 transition"
            >
              {playingIndex === index
                ? <Pause className="w-4 h-4" />
                : <Play className="w-4 h-4 ml-0.5" />
              }
            </button>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.prompt}</p>
              <p className="text-xs text-gray-400 mt-0.5">AI Generated Track</p>

              {/* Waveform-style visual bar */}
              <div className="flex items-end gap-0.5 mt-2 h-5">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      playingIndex === index ? 'bg-purple-400 animate-pulse' : 'bg-gray-300'
                    }`}
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Native audio (hidden but functional) */}
          <audio
  ref={(el) => {
    if (el) audioRefs.current[index] = el;
  }}
  src={item.url || ''}
  controls={!!item.url}
  onEnded={() => setPlayingIndex(null)}
  className={`h-8 w-36 transition ${
    item.url ? "opacity-60 group-hover:opacity-100" : "hidden"
  }`}
/>
          </div>
        ))}
      </div>
    </div>
  )
}