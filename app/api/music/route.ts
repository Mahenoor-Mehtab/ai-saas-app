import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return new NextResponse('Prompt is required', { status: 400 })
    }

    // ✅ Debug: check if key is loaded
    const apiKey = process.env.HUGGINGFACE_API_KEY
    console.log('API Key exists:', !!apiKey)
    console.log('API Key prefix:', apiKey?.substring(0, 5)) // should print "hf_xx"

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/facebook/musicgen-small', // small first to test
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    )

    // ✅ Log everything
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Full error:', errorText)
      return NextResponse.json({ 
        error: errorText, 
        status: response.status 
      }, { status: 500 })  // ✅ return error to frontend so you can see it
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Audio = `data:audio/flac;base64,${buffer.toString('base64')}`

    return NextResponse.json({ audio: base64Audio })

  } catch (error) {
    console.error('[MUSIC_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}