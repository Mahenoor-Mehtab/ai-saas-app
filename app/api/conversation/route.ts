import OpenAI from 'openai'  // ✅ same openai package
import { NextResponse } from 'next/server'

// ✅ Just point baseURL to Groq + use Groq API key
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1/'  
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || messages.length === 0) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    const response = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile', // Groq model
  messages: [
    {
      role: 'system',
      content: 'You are a helpful AI assistant. Answer concisely.'
    },
    ...messages.slice(-5) // Only last 5 messages → saves context tokens
  ],
  max_tokens: 512,       // Limit response → fewer tokens
  temperature: 0.5,      // Concise, less random → shorter answers
})

    const reply = response.choices[0]?.message

    return NextResponse.json(reply)

  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}