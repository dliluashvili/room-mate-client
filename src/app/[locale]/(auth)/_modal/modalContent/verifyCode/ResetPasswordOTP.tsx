'use client'

import { Button } from '@/src/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/src/components/ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Dispatch, SetStateAction, useState } from 'react'
import { useMutation } from '@apollo/client'
import { ResetPassword, ResetPasswordVerifyCode } from '@/graphql/mutation'
import { ArrowLeft } from '@/src/components/svgs'
import { Input } from '@/src/components/ui/input'
import { VerificationCodeValidityStatus } from '@/graphql/typesGraphql'
import { usePathname, useRouter } from 'next/navigation'

type otpType = {
    setVerifyCode: Dispatch<SetStateAction<boolean>>
    modalType: string
    identifier: string
}

export function InputOTPForm({ setVerifyCode, identifier, modalType }: otpType) {
    const { t } = useTranslation()
    const [newPassword, setNewPassword] = useState(false)
    const pathname = usePathname()

    const [verifyCode] = useMutation(ResetPasswordVerifyCode)
    const [resetPasswordSubmit] = useMutation(ResetPassword)
    const router = useRouter()

    const isLandlordsPath =
        pathname.includes('/landlords') ||
        pathname.includes('/upload-apartment') ||
        pathname.includes('/apartment-list') ||
        pathname.includes('/landlord-profile')

    const codeFormSchema = z.object({
        code: z.string().min(6),
    })

    const codeForm = useForm<z.infer<typeof codeFormSchema>>({
        resolver: zodResolver(codeFormSchema),
        defaultValues: {
            code: '',
        },
    })

    const resetPasswordFormSchema = z
        .object({
            password: z
                .string()
                .min(6, { message: t('minPassword') })
                .regex(/(?=.*[0-9])(?=.*[^0-9]).{6,30}/, {
                    message: t('passwordValidationError'),
                }),
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('passwordMatchError'),
            path: ['confirmPassword'], // Set the error path to 'confirmPassword'
        })

    type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>

    const resetPasswordForm = useForm<ResetPasswordFormSchema>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const verifyCodeHandler = async () => {
        const code = codeForm.getValues().code
        const { data, errors } = await verifyCode({
            variables: { input: { code: code, identifier: identifier } },
        })

        if (errors) {
            console.error(errors)
        } else if (
            data?.verifyResetPasswordVerificationCode?.status ===
            VerificationCodeValidityStatus.Valid
        ) {
            setNewPassword(true)
        } else if (
            data?.verifyResetPasswordVerificationCode?.status ===
            VerificationCodeValidityStatus.Invalid
        ) {
            codeForm.setError('code', { message: t('codeExpired') })
        } else if (
            data?.verifyResetPasswordVerificationCode?.status ===
            VerificationCodeValidityStatus.NotFound
        ) {
            codeForm.setError('code', { message: t('invalidCode') })
        }
    }

    const resetPasswordSubmitHandler = async () => {
        const code = codeForm.getValues().code
        const { data, errors } = await resetPasswordSubmit({
            variables: {
                input: {
                    code: code,
                    identifier: identifier,
                    password: resetPasswordForm.getValues().password,
                    confirmPassword: resetPasswordForm.getValues().confirmPassword,
                },
            },
        })

        if (errors) {
            console.log(errors)
        } else if (data) {
            if (data?.resetPassword === true) {
                if (isLandlordsPath) {
                    router.push('/?modal=signinLandlords')
                } else {
                    router.push('/?modal=signinRoommates')
                }
            }
        }
    }

    return (
        <>
            {!newPassword ? (
                <div className="w-full">
                    <div className="flex w-full justify-start">
                        <button
                            onClick={() => setVerifyCode(false)}
                            className="flex cursor-pointer flex-row items-center gap-1 outline-none"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="mb-1 text-xs text-[#838CAC]">{t('back')}</span>
                        </button>
                    </div>
                    <Form {...codeForm}>
                        <form
                            onSubmit={codeForm.handleSubmit(verifyCodeHandler)}
                            className="flex w-full flex-col items-center space-y-6"
                        >
                            <FormField
                                control={codeForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex w-full justify-center py-6">
                                            <span className="text-center leading-6">
                                                {t('codeSentOn')} <br /> {identifier} <br />
                                                {t('fillField')}
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup className="flex w-full justify-center gap-4">
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit">
                                {t('verify')}
                            </Button>
                        </form>
                    </Form>
                </div>
            ) : newPassword ? (
                <div className="flex w-full flex-col items-start gap-6">
                    <div className="flex w-full justify-start">
                        <button
                            className="flex cursor-pointer flex-row  items-center gap-1 outline-none"
                            onClick={() => {
                                setNewPassword(false)
                            }}
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="mb-1 text-xs text-[#838CAC]">უკან</span>
                        </button>
                    </div>
                    <div className="flex w-full justify-center">
                        <h1>{t('resetPassword')}</h1>
                    </div>
                    <Form {...resetPasswordForm}>
                        <form
                            className="flex w-full flex-col gap-2"
                            onSubmit={resetPasswordForm.handleSubmit(resetPasswordSubmitHandler)}
                        >
                            <FormField
                                control={resetPasswordForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('password')}</FormLabel>
                                        <Input
                                            value={field.value}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={resetPasswordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('confirmPassword')}</FormLabel>
                                        <Input
                                            value={field.value}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="mt-3 w-full">
                                {t('submit')}
                            </Button>
                        </form>
                    </Form>
                </div>
            ) : null}
        </>
    )
}
