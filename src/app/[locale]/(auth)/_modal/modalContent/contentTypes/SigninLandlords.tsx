import { ArrowLeft } from '@/src/components/svgs'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { landlordsSigninSchema, SigninFormValues } from '../validators/landlordsSigninValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client'
import { signIn } from '@/src/auth/signIn'
import { LandlordSignIn } from '@/graphql/mutation'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'

type SigninLandlordsProps = {
    landlordsResetPasswordHandler: () => void
    signinChoosTypeHandler: () => void
}

export default function SigninLandlords({
    landlordsResetPasswordHandler,
    signinChoosTypeHandler,
}: SigninLandlordsProps) {
    const { t } = useTranslation()
    const router = useRouter()

    const form = useForm<SigninFormValues>({
        resolver: zodResolver(landlordsSigninSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    })

    const [login] = useMutation(LandlordSignIn)

    const onSubmit: SubmitHandler<SigninFormValues> = async () => {
        const { identifier, password } = form.getValues()
        const { data, errors } = await login({ variables: { input: { identifier, password } } })

        if (errors) {
            if (errors[0]?.extensions?.code === 'BAD_REQUEST') {
                if (errors[0].extensions?.errorCode === 'USER__NOT_FOUND') {
                    form.setError('identifier', { message: t('userNotFound') })
                } else if (errors[0].extensions?.errorCode === 'PASSWORD__INCORRECT') {
                    form.setError('password', { message: t('incorrectPassword') })
                } else if (
                    errors[0]?.extensions?.errorCode === 'IDENTIFIER__INVALID:EMAIL_OR_PHONE'
                ) {
                    form.setError('identifier', { message: t('enterPhoneOrEmail') })
                }
            }
        } else if (data?.landlordSignIn) {
            signIn(data.landlordSignIn)
            router.push('/landlords')
        }
    }
    return (
        <div className="flex w-full flex-col gap-4">
            <button className="flex flex-row items-center gap-1" onClick={signinChoosTypeHandler}>
                <ArrowLeft className="h-5 w-5" />
                <span className="mb-1 text-xs text-[#838CAC]">{t('back')}</span>
            </button>
            <h1 className="text-center text-xl  text-textColor">{t('signinAsLandlords')}</h1>
            <Form {...form}>
                <form
                    className="grid w-full grid-cols-1 gap-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('phoneNumOrEmail')}</FormLabel>
                                <Input value={field.value} onChange={(e) => field.onChange(e)} />
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
                                    value={field.value}
                                    type="password"
                                    onChange={(e) => field.onChange(e)}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex w-full flex-row items-center justify-end">
                        <button
                            type="button"
                            onClick={landlordsResetPasswordHandler}
                            className="w-auto text-xs text-[#838CAC]"
                        >
                            {t('forgotPass')}
                        </button>
                    </div>
                    <Button type="submit" className="w-full">
                        {t('signIn')}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
