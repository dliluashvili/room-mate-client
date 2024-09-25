import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'
import { useTranslation } from 'react-i18next'

export function LandlordSignupEmailValidator() {
    const { t } = useTranslation()
    const landlordsSignupSchema: z.ZodSchema = z.object({
        firstname: z.string().min(2, { message: '' }),
        lastname: z.string().min(2, { message: '' }),
        email: z.string().email().min(2, { message: '' }),
        password: z
            .string()
            .min(6, { message: t('minpass') })
            .refine((value) => /(?=.*[0-9])(?=.*[^0-9]).{6,30}/.test(value), {
                message: t('passwordValidationError'),
            }),
        confirmPassword: z.string().refine((value) => value === form.getValues().password, {
            message: t('passwordMatchError'),
        }),
    })

    const form = useForm<z.infer<typeof landlordsSignupSchema>>({
        resolver: zodResolver(landlordsSignupSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    return form
}
