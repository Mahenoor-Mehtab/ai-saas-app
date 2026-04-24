import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1/'
})

const SYSTEM_PROMPT = `You are a helpful AI assistant for Genius — an AI SaaS platform. 
You help users understand the platform's features:
- AI Conversation (Chat)
- Code Generation
- Image Generation
- Music Generation  
- Video Generation
- Free tier with usage limits
- Pro plan for unlimited access

Keep answers short, friendly, and helpful. Max 3-4 sentences.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || messages.length === 0) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-5)
      ],
      max_tokens: 256,
      temperature: 0.5,
    })

    const reply = response.choices[0]?.message
    return NextResponse.json(reply)

  } catch (error) {
    console.error('[ASK_AI_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}