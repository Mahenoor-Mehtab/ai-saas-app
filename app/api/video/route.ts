import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { prompt } = body

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 })
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return new NextResponse("Replicate API token not configured", { status: 500 })
    }

    // Using Zeroscope V2 XL for text-to-video generation
    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt,
          num_frames: 24,
          num_inference_steps: 50,
          fps: 8,
          width: 1024,
          height: 576,
        },
      }
    )

    // Replicate returns an array for video; get the first item
    const videoUrl = Array.isArray(response) ? response[0] : response

    return NextResponse.json({ video: videoUrl })

  } catch (error) {
    console.error("[VIDEO_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}