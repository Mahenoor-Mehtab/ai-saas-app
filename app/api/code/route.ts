import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: 'https://api.groq.com/openai/v1/',
})

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
    {
      role: 'system',
      content: 'You are a code generator. Answer concisely in markdown code blocks. Use code comments for explanations.'
    },
    ...messages.slice(-5) // only last 5 messages → save tokens
  ],
  max_tokens: 512, // reduce from 2048 → 1/4 tokens used
  temperature: 0.5, // optional → shorter, more concise answers
})

    const reply = response.choices[0]?.message
    return NextResponse.json(reply)

  } catch (error) {
    console.error('[CODE_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}