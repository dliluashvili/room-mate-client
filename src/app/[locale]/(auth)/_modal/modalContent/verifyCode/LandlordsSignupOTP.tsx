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
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useMutation } from '@apollo/client'
import { LandlordSignUp, VerifyCodeByEmail, VerifyCodeBySms } from '@/graphql/mutation'
import { signIn } from '@/src/auth/signIn'
import { useRouter } from 'next/navigation'
import { GraphQLFormattedError } from 'graphql'
import { ArrowLeft } from '@/src/components/svgs'
import { CodePurpose, VerificationCodeValidityStatus } from '@/graphql/typesGraphql'

const FormSchema = z.object({
    code: z.string().min(6, {
        message: 'Code must be 6 characters long',
    }),
})

export function LandlordsSignupOTP({ signupMethod, setSignupMethod, formData }: any) {
    const { t } = useTranslation()
    const router = useRouter()

    const [verifyCodeEmail] = useMutation(VerifyCodeByEmail)
    const [verifyCodeSms] = useMutation(VerifyCodeBySms)
    const [signupLandlords] = useMutation(LandlordSignUp)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            code: '',
        },
    })

    const handleCommonErrors = (errors: readonly GraphQLFormattedError[], form: any) => {
        const firstError = errors[0]
        if (firstError?.extensions?.code === 'BAD_REQUEST') {
            const errorCode = firstError.extensions?.errorCode

            if (typeof errorCode === 'string') {
                const errorMessages: { [key: string]: string } = {
                    USER__EXISTS_WITH_EMAIL: t('userExistsWithMail'),
                    EMAIL__INVALID: 'EMAIL__INVALID',
                    'FIRSTNAME__MAX:30': 'FIRSTNAME__MAX:30',
                    'LASTNAME__MAX:100': 'LASTNAME__MAX:100',
                    PASSWORD__INCORRECT_PATTERN: 'PASSWORD__INCORRECT_PATTERN',
                    'PASSWORD__MIN:6': 'PASSWORD__MIN:6',
                    'PASSWORD__MAX:30': 'PASSWORD__MAX:30',
                    CONFIRM_PASSWORD__NOT_EQUAL: 'CONFIRM_PASSWORD__NOT_EQUAL',
                    USER__EXISTS_WITH_PHONE: t('userExistsWithPhone'),
                    PHONE_OR_EMAIL__REQUIRED: 'PHONE_OR_EMAIL__REQUIRED',
                    'USER__EXISTS_WITH_PHONE:roommate': t('phoneUsedOnRoommate'),
                }

                if (errorCode in errorMessages) {
                    form.setError('code', {
                        message: errorMessages[errorCode as keyof typeof errorMessages],
                    })
                }
            }
        }
    }

    const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async () => {
        try {
            if (signupMethod === 'verifyCodeByEmail') {
                const { code } = form.getValues()
                const { email, password, confirmPassword, firstname, lastname } =
                    formData.getValues()

                const { data: verifyEmail, errors: verifyEmailErrors } = await verifyCodeEmail({
                    variables: {
                        input: {
                            code,
                            email,
                            codePurpose: CodePurpose.LandlordSignUp,
                        },
                    },
                })

                if (verifyEmailErrors) {
                    throw new Error('Failed verify code')
                } else if (verifyEmail?.verifyCodeByEmail.status === 'VALID') {
                    const { data: signupDataEmail, errors: signupEmailErrors } =
                        await signupLandlords({
                            variables: {
                                input: {
                                    firstname,
                                    lastname,
                                    email,
                                    password,
                                    confirmPassword,
                                },
                            },
                        })

                    if (signupEmailErrors) {
                        handleCommonErrors(signupEmailErrors, form)
                    } else if (signupDataEmail) {
                        signIn(signupDataEmail?.landlordSignUp?.jwt)
                        router.push('/landlords')
                    }
                } else if (
                    verifyEmail?.verifyCodeByEmail.status === VerificationCodeValidityStatus.Invalid
                ) {
                    form.setError('code', { message: t('codeExpired') })
                } else if (verifyEmail?.verifyCodeByEmail.status === 'NOT_FOUND') {
                    form.setError('code', { message: t('incorrectCode') })
                }
            } else if (signupMethod === 'verifyCodeBySms') {
                const { code } = form.getValues()
                const { phone, password, confirmPassword, firstname, lastname } =
                    formData.getValues()

                const { data: verifySms, errors: verifySmsErrors } = await verifyCodeSms({
                    variables: {
                        input: {
                            code,
                            phone,
                            codePurpose: CodePurpose.LandlordSignUp,
                        },
                    },
                })
                if (verifySmsErrors) {
                    throw new Error('Failed verify code')
                } else if (verifySms?.verifyCodeBySms?.status === 'VALID') {
                    const { data: signupDataSms, errors: signupDataSmsErrors } =
                        await signupLandlords({
                            variables: {
                                input: {
                                    firstname,
                                    lastname,
                                    phone,
                                    password,
                                    confirmPassword,
                                },
                            },
                        })

                    if (signupDataSmsErrors) {
                        handleCommonErrors(signupDataSmsErrors, form)
                    } else if (signupDataSms) {
                        signIn(signupDataSms?.landlordSignUp?.jwt)
                        router.push('/landlords')
                    }
                } else if (verifySms?.verifyCodeBySms?.status === 'INVALID') {
                    form.setError('code', { message: t('expired') })
                } else if (verifySms?.verifyCodeBySms.status === 'NOT_FOUND') {
                    form.setError('code', { message: t('incorrect code') })
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const backButtonHandler = () => {
        if (signupMethod === 'verifyCodeByEmail') {
            setSignupMethod('email')
        } else if (signupMethod === 'verifyCodeBySms') setSignupMethod('phone')
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" flex w-full flex-col items-center space-y-6 "
            >
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex w-full justify-center py-6">
                                <span className="text-center leading-6">
                                    {t('codeSentOn')} <br />
                                    {signupMethod === 'verifyCodeByEmail'
                                        ? formData.getValues().email
                                        : formData.getValues().phone}
                                    <br />
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
                <div className="w-full">
                    <button
                        type="button"
                        className="flex cursor-pointer flex-row items-center justify-start gap-1 outline-none"
                        onClick={backButtonHandler}
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="mb-1 text-xs text-[#838CAC]">{t('back')}</span>
                    </button>
                </div>
            </form>
        </Form>
    )
}
