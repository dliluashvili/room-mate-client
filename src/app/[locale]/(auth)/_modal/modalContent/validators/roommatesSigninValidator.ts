import { z } from 'zod'

export const roommatesSigninSchema = z.object({
    identifier: z.string().min(1, { message: '' }),
    password: z.string().min(1, { message: '' }),
})

export type SigninFormValues = z.infer<typeof roommatesSigninSchema>
