import { z } from "zod"
export const signUpSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
    username: z.string().trim().min(1, "Username is required").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
})

export type LoginValues = z.infer<typeof loginSchema>