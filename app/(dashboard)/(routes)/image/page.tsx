'use client'

import { useState } from "react"
import { Loader, Image as ImageIcon, Download, Trash2 } from "lucide-react"
import axios from "axios"

const ImagePage = () => {
  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(1)

  const generateImage = async () => {
    if (!prompt.trim()) return

    try {
      setLoading(true)
      setImages([])

      // ✅ Hugging Face API route call
      const response = await axios.post('/api/image', {
        prompt,
        amount: count
      })

      setImages(response.data.images)

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `image-${index + 1}.png`
    link.click()
  }

  return (
    <div className="bg-white min-h-screen p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Image Generation</h1>
            <p className="text-sm text-gray-500">Generate AI images from text prompts</p>
          </div>
        </div>

        {/* ✅ Clear Button */}
        {images.length > 0 && (
          <button
            onClick={() => setImages([])}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Prompt Input */}
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !loading && generateImage()}
        placeholder="e.g. A futuristic city at sunset..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-pink-500 text-sm"
        disabled={loading}
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">

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

        {/* Generate Button */}
        <button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          className="px-6 h-9 bg-pink-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-pink-700 transition"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex flex-col items-center gap-2 p-6">
          <Loader className="animate-spin text-pink-600" />
          <p className="text-sm text-gray-400">
            Generating {count} image{count > 1 ? 's' : ''}... please wait 10-20 sec
          </p>
        </div>
      )}

      {/* Empty State */}
      {!images.length && !loading && (
        <div className="text-gray-400 text-sm text-center py-10">
          No images generated yet. Enter a prompt and click Generate ☝️
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1 max-w-md' : 'grid-cols-2'}`}>
          {images.map((url, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square">
              <img
                src={url}
                alt={`Generated ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* ✅ Download Button on Hover */}
              <button
                onClick={() => handleDownload(url, i)}
                className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ImagePage