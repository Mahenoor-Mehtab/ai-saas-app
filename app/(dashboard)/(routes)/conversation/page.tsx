'use client'
import Heading from '@/components/heading'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, MessageSquare } from 'lucide-react'
import { formSchema } from './constants'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from "react-hook-form";
import { useState } from 'react'
import axios from 'axios'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const ConversationPage = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false) // ✅ FIX

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)

      const userMessage: Message = {
        role: 'user',
        content: values.prompt
      }

      // ✅ Send full history so AI remembers context
      const newMessages = [...messages, userMessage]

      // ✅ Call your API route (not Puter.js directly)
      const response = await axios.post('/api/conversation', {
        messages: newMessages
      })

      // ✅ Groq returns { role, content } directly
      setMessages(prev => [...prev, userMessage, response.data])

      form.reset()

    } catch (error) {
      // TODO: Open pro modal
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Heading
        title="Conversation"
        description="Chat with the smartest AI"
        icon={MessageSquare}
        iconColor='text-violet-500'
        bgColor='bg-violet-500/10'
      />

      <div className='px-4 lg:px-8'>
        
        {/* FORM */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='rounded-lg border w-full p-4 grid grid-cols-12 gap-2'
        >
          <div className='col-span-12 lg:col-span-10'>
            <Input
              {...form.register("prompt")}
              placeholder='Type your message here...'
              disabled={loading} 
              className='border-0 focus-visible:ring-0'
            />

            {form.formState.errors.prompt && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.prompt.message}
              </p>
            )}
          </div>

          <Button
            className='col-span-12 lg:col-span-2 w-full'
            disabled={loading} // ✅ FIX
            type='submit'
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </form>

        {/* MESSAGES */}
        <div className='space-y-4 mt-4'>

          {loading && (
            <div className='p-8 rounded-lg flex justify-center bg-gray-100'>
              <Loader className='animate-spin' />
            </div>
          )}

          {messages.length === 0 && !loading && (
            <div className="text-gray-500 text-sm">
              Empty!
            </div>
          )}

          <div className='flex flex-col gap-y-4'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 text-right'
                    : 'bg-gray-100 text-left'
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ConversationPage