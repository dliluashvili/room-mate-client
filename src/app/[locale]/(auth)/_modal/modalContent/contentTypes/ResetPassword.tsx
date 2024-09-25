import { ArrowLeft } from '@/src/components/svgs'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { InputOTPForm } from '../verifyCode/ResetPasswordOTP'
import { useTranslation } from 'react-i18next'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { LandlordResetPasswordCode, RoommateResetPasswordCode } from '@/graphql/mutation'

type ResetPasswordProps = {
    signinRoommatesHandler: () => void
    signinLandlordsHandler: () => void
    modalType: string
}

export default function ResetPassword({
    signinRoommatesHandler,
    signinLandlordsHandler,
    modalType,
}: ResetPasswordProps) {
    const [verifyCode, setVerifyCode] = useState(false)
    const { t } = useTranslation()
    const phoneFormFormSchema = z.object({
        phone: z
            .string()
            .trim()
            .min(1, { message: '' })
            .refine(
                (value) => {
                    const isPhone = /^\d+$/.test(value)
                    return isPhone
                },
                { message: t('invalidPhone') }
            ),
    })

    const identifierFormSchema = z.object({
        identifier: z
            .string()
            .trim()
            .min(1, { message: '' })
            .refine(
                (value) => {
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    const isPhone = /^\d+$/.test(value)
                    return isEmail || isPhone
                },
                { message: t('invalidPhoneOrMail') }
            ),
    })

    const phoneForm = useForm<z.infer<typeof phoneFormFormSchema>>({
        resolver: zodResolver(phoneFormFormSchema),
        defaultValues: {
            phone: '',
        },
    })

    const identifierForm = useForm<z.infer<typeof identifierFormSchema>>({
        resolver: zodResolver(identifierFormSchema),
        defaultValues: {
            identifier: '',
        },
    })

    const [resetPasswordRoommatesCode] = useMutation(RoommateResetPasswordCode)
    const [resetPasswordLandlordsCode] = useMutation(LandlordResetPasswordCode)

    const identifier =
        modalType === 'resetPasswordRoommates'
            ? phoneForm.getValues().phone
            : identifierForm.getValues().identifier

    const onSubmit = async () => {
        if (modalType === 'resetPasswordRoommates') {
            const { data, errors } = await resetPasswordRoommatesCode({
                variables: { input: { identifier: phoneForm.getValues().phone } },
            })

            if (errors) {
                if (errors[0].extensions?.errorCode === 'USER__NOT_FOUND') {
                    phoneForm.setError('phone', { message: t('userNotFound') })
                } else if (errors[0].extensions?.errorCode === 'IDENTIFIER__INVALID:PHONE') {
                    phoneForm.setError('phone', { message: t('invalidPhone') })
                }
            } else if (data) {
                if (
                    data?.roommateSendResetPasswordVerificationCode?.status ===
                        'SUCCESSFULLY_SEND' ||
                    data?.roommateSendResetPasswordVerificationCode?.status === 'ALREADY_SENT'
                ) {
                    setVerifyCode(true)
                } else {
                    if (data?.roommateSendResetPasswordVerificationCode?.status === 'SEND_FAILED') {
                        phoneForm.setError('phone', { message: t('noSendCode') })
                    }
                }
            }
        } else if (modalType === 'resetPasswordLandlords') {
            const { data, errors } = await resetPasswordLandlordsCode({
                variables: { input: { identifier: identifierForm.getValues().identifier } },
            })

            if (errors) {
                if (errors[0].extensions?.errorCode === 'USER__NOT_FOUND') {
                    identifierForm.setError('identifier', { message: t('userNotFound') })
                } else if (
                    errors[0].extensions?.errorCode === 'IDENTIFIER__INVALID:EMAIL_OR_PHONE'
                ) {
                    identifierForm.setError('identifier', {
                        message: t('invalidPhoneOrMail'),
                    })
                }
            } else if (data) {
                if (
                    data?.landlordSendResetPasswordVerificationCode?.status ===
                        'SUCCESSFULLY_SEND' ||
                    data?.landlordSendResetPasswordVerificationCode?.status === 'ALREADY_SENT'
                ) {
                    setVerifyCode(true)
                } else {
                    if (data?.landlordSendResetPasswordVerificationCode.status === 'SEND_FAILED') {
                        identifierForm.setError('identifier', { message: t('noSendCode') })
                    }
                }
            }
        }
    }
    return (
        <>
            {modalType === 'resetPasswordRoommates' && !verifyCode ? (
                <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full justify-start">
                        <button
                            className="flex cursor-pointer flex-row items-center gap-1 outline-none"
                            onClick={
                                modalType === 'resetPasswordRoommates'
                                    ? signinRoommatesHandler
                                    : signinLandlordsHandler
                            }
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="mb-1 text-xs text-[#838CAC]">{t('back')}</span>
                        </button>
                    </div>
                    <h1 className="text-center text-base">{t('resetPassword')}</h1>
                    <div className="flex w-full flex-col gap-2">
                        <Form {...phoneForm}>
                            <form onSubmit={phoneForm.handleSubmit(onSubmit)}>
                                <FormField
                                    control={phoneForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('phoneNum')}</FormLabel>
                                            <Input
                                                value={field.value}
                                                onChange={(e) => field.onChange(e)}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="mt-3 w-full">
                                    {t('getCode')}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            ) : modalType === 'resetPasswordLandlords' && !verifyCode ? (
                <div className="flex w-full flex-col gap-4 ">
                    <div className="flex w-full justify-start">
                        <button
                            className="flex cursor-pointer flex-row items-center gap-1 outline-none"
                            onClick={
                                modalType === 'resetPasswordLandlords'
                                    ? signinLandlordsHandler
                                    : signinRoommatesHandler
                            }
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="mb-1 text-xs text-[#838CAC]">{t('back')}</span>
                        </button>
                    </div>

                    <h1 className="text-center text-base">{t('resetPassword')}</h1>
                    <Form {...identifierForm}>
                        <form onSubmit={identifierForm.handleSubmit(onSubmit)}>
                            <FormField
                                control={identifierForm.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('mail')} / {t('phoneNum')}
                                        </FormLabel>
                                        <Input
                                            value={field.value}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="mt-3 w-full">
                                {t('getCode')}
                            </Button>
                        </form>
                    </Form>
                </div>
            ) : verifyCode ? (
                <div className="flex w-full flex-col items-center gap-6 text-sm">
                    <InputOTPForm
                        setVerifyCode={setVerifyCode}
                        modalType={modalType}
                        identifier={identifier}
                    />
                </div>
            ) : null}
        </>
    )
}
