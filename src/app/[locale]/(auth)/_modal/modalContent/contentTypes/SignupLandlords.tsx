import PhoneInput from '@/src/components/shared/phoneInput/PhoneInput'
import { ArrowLeft, AuthSmsIcon, Call } from '@/src/components/svgs'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { SendCodeByEmail, SendCodeBySms } from '@/graphql/mutation'
import { useMutation } from '@apollo/client'
import { LandlordsSignupOTP } from '../verifyCode/LandlordsSignupOTP'
import { LandlordSignUpPhoneValidator } from '../validators/landlordSignupPhone'
import { LandlordSignupEmailValidator } from '../validators/landlordSignupEmail'
import { CodePurpose } from '@/graphql/typesGraphql'

type SignupLandlordsProps = {
    signupChoosTypeHandler: () => void
}

export default function SignupLandlords({ signupChoosTypeHandler }: SignupLandlordsProps) {
    const { t } = useTranslation()
    const [signupMethod, setSignupMethod] = useState<string | null>(null)
    const [sendCodeEmail] = useMutation(SendCodeByEmail)
    const [sendCodeSms] = useMutation(SendCodeBySms)

    const form =
        signupMethod === 'email' ? LandlordSignupEmailValidator() : LandlordSignUpPhoneValidator()

    const handleSubmit = async () => {
        try {
            if (signupMethod === 'email') {
                const { email } = form.getValues()
                const { data, errors } = await sendCodeEmail({
                    variables: { input: { email } },
                })

                if (errors) {
                    console.error('Email errors:', errors)
                    throw new Error('Failed to send email code')
                }

                if (
                    data?.sendCodeByEmail?.status === 'SUCCESS' ||
                    data?.sendCodeByEmail?.status === 'ALREADY_SENT'
                ) {
                    setSignupMethod('verifyCodeByEmail')
                }
            } else if (signupMethod === 'phone') {
                const { phone } = form.getValues()
                const { data, errors } = await sendCodeSms({
                    variables: { input: { phone, codePurpose: CodePurpose.LandlordSignUp } },
                })

                if (errors) {
                    console.error('Phone errors:', errors)
                    throw new Error('Failed to send SMS code')
                }

                if (
                    data?.sendCodeBySms?.status === 'SUCCESS' ||
                    data?.sendCodeBySms?.status === 'ALREADY_SENT'
                ) {
                    setSignupMethod('verifyCodeBySms')
                }
            }
        } catch (error) {
            console.error('Submission error:', error)
        }
    }

    return (
        <>
            {!signupMethod ? (
                <div className="flex w-full flex-col gap-4">
                    <h1 className="text-center text-xl  text-textColor">
                        {t('signupForLandlord')}
                    </h1>
                    <button
                        onClick={() => setSignupMethod('email')}
                        className="flex h-10 w-full flex-row items-center justify-center gap-4 rounded-lg border border-[#838CAC] outline-none hover:border-hoverGreen"
                    >
                        <AuthSmsIcon className="h-6 w-6" />
                        <span>{t('whithEmail')}</span>
                    </button>
                    <button
                        onClick={() => setSignupMethod('phone')}
                        className=" flex  h-10 w-full flex-row items-center justify-center gap-4 rounded-lg border border-[#838CAC] outline-none hover:border-hoverGreen"
                    >
                        <Call className="h-6 w-6" />
                        <span>{t('withPhone')}</span>
                    </button>
                    <button
                        className="mt-2 flex cursor-pointer flex-row items-center gap-1 outline-none"
                        onClick={signupChoosTypeHandler}
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="mb-1 text-xs text-[#838CAC]">{t('back')}</span>
                    </button>
                </div>
            ) : signupMethod === 'email' || signupMethod === 'phone' ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="grid w-full grid-cols-1 gap-y-2"
                    >
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('name')}</FormLabel>
                                    <Input
                                        hasError={
                                            !!form.formState.errors.firstname &&
                                            form.formState.dirtyFields.firstname
                                        }
                                        isSuccess={
                                            !form.formState.errors.firstname &&
                                            form.formState.dirtyFields.firstname
                                        }
                                        value={field.value}
                                        onChange={(e) => field.onChange(e)}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('surname')}</FormLabel>
                                    <Input
                                        hasError={
                                            !!form.formState.errors.lastname &&
                                            form.formState.dirtyFields.lastname
                                        }
                                        isSuccess={
                                            !form.formState.errors.lastname &&
                                            form.formState.dirtyFields.lastname
                                        }
                                        value={field.value}
                                        onChange={(e) => field.onChange(e)}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('password')}</FormLabel>
                                    <Input
                                        type="password"
                                        hasError={
                                            !!form.formState.errors.password &&
                                            form.formState.dirtyFields.password
                                        }
                                        isSuccess={
                                            !form.formState.errors.password &&
                                            form.formState.dirtyFields.password
                                        }
                                        value={field.value}
                                        onChange={(e) => field.onChange(e)}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('confirmPassword')}</FormLabel>
                                    <Input
                                        type="password"
                                        hasError={
                                            !!form.formState.errors.confirmPassword &&
                                            form.formState.dirtyFields.confirmPassword
                                        }
                                        isSuccess={
                                            !form.formState.errors.confirmPassword &&
                                            form.formState.dirtyFields.confirmPassword
                                        }
                                        value={field.value}
                                        onChange={(e) => field.onChange(e)}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {signupMethod === 'email' ? (
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('mail')}</FormLabel>
                                        <Input
                                            hasError={
                                                !!form.formState.errors.email &&
                                                form.formState.dirtyFields.email
                                            }
                                            isSuccess={
                                                !form.formState.errors.email &&
                                                form.formState.dirtyFields.email
                                            }
                                            value={field.value}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                        {form.getValues().email !== undefined ? (
                                            <FormMessage />
                                        ) : null}
                                    </FormItem>
                                )}
                            />
                        ) : signupMethod === 'phone' ? (
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('phoneNum')}</FormLabel>
                                        <div className="relative">
                                            <PhoneInput
                                                type="number"
                                                defaultCountry="GE"
                                                international
                                                field={field}
                                                labels={undefined}
                                                form={form}
                                                value={field.value}
                                                onChange={(phone: string) => {
                                                    form.setValue('phone', phone)
                                                }}
                                            />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : null}
                        <Button type="submit" className="mt-3 w-full">
                            {t('getCode')}
                        </Button>
                        <button
                            className="mt-2 flex cursor-pointer flex-row items-center gap-1 outline-none"
                            onClick={() => setSignupMethod(null)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="mb-1 text-xs text-[#838CAC]">{t('back')}</span>
                        </button>
                    </form>
                </Form>
            ) : signupMethod === 'verifyCodeByEmail' || signupMethod === 'verifyCodeBySms' ? (
                <LandlordsSignupOTP
                    signupMethod={signupMethod}
                    formData={form}
                    setSignupMethod={setSignupMethod}
                />
            ) : null}
        </>
    )
}
