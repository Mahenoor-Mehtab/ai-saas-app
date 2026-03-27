import * as z from "zod";

// validation schema for the form
export const formSchema = z.object({
    prompt: z.string()
    .min(1,{ message: 'Prompt is required' })
    .max(100, { message: "Max 100 characters allowed" })
})