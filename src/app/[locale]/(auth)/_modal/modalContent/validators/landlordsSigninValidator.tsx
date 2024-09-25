import { z } from 'zod'

export const landlordsSigninSchema = z.object({
    identifier: z.string().min(1, { message: '' }),
    password: z.string().min(1, { message: '' }),
})

export type SigninFormValues = z.infer<typeof landlordsSigninSchema>
