'use client'

import { useState } from "react"
import { Loader, Image as ImageIcon } from "lucide-react"

declare global {
  interface Window {
    puter: any
  }
}

const ImagePage = () => {
  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(1)
  const [resolution, setResolution] = useState<'256x256' | '512x512' | '1024x1024'>('512x512')

  const generateImage = async () => {
    if (!prompt.trim()) return

    try {
      setLoading(true)
      setImages([])

      const requests = Array.from({ length: count }, () =>
        window.puter.ai.txt2img(prompt, false, resolution)
      )

      const responses = await Promise.all(requests)

      const urls = responses.map((res: any) => {
        if (res instanceof HTMLImageElement) return res.src
        if (typeof res === 'string') return res
        return res?.src || res?.url || ''
      }).filter(Boolean)

      setImages(urls)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-pink-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Image Generation</h1>
          <p className="text-sm text-gray-500">Generate AI images from text prompts</p>
        </div>
      </div>

      {/* Prompt Input */}
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. A futuristic city at sunset"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-pink-500"
        disabled={loading}
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">

        {/* Number of Images */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Number of Images</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-9 h-9 rounded-lg border text-sm font-medium transition
                  ${count === n
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-pink-400'
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Resolution</label>
          <div className="flex gap-2">
            {(['256x256', '512x512', '1024x1024'] as const).map(r => (
              <button
                key={r}
                onClick={() => setResolution(r)}
                className={`px-3 h-9 rounded-lg border text-xs font-medium transition
                  ${resolution === r
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-pink-400'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          className="mt-4 px-6 h-9 bg-pink-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center p-6">
          <Loader className="animate-spin text-gray-600" />
        </div>
      )}

      {/* Empty State */}
      {!images.length && !loading && (
        <div className="text-gray-400 text-sm text-center py-10">
          No images generated yet. Enter a prompt and click Generate.
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1 max-w-md' : 'grid-cols-2'}`}>
          {images.map((url, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square">
              <img
                src={url}
                alt={`Generated ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ImagePage