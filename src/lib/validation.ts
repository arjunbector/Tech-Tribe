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

export const createPostSchema = z.object({
    content: z.string().min(1, "Content is required"),
    mediaIds:z.array(z.string()).max(5, "Cannot upload more than 5 attachments")
})

export const updateUserProfileSchema = z.object({
    displayName: z.string().min(1, "Display name is required"),
    bio: z.string().max(1000, "Must be atmost 1000 characters"),
})

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>