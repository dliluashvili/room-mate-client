import { RoommateSignIn } from '@/graphql/mutation'
import { signIn } from '@/src/auth/signIn'
import { ArrowLeft } from '@/src/components/svgs'
import { Button } from '@/src/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { roommatesSigninSchema, SigninFormValues } from '../validators/roommatesSigninValidator'

type SigninRoommatesProps = {
    signinChoosTypeHandler: () => void
    roommatesResetPasswordHandler: () => void
}

export default function SigninRoommates({
    signinChoosTypeHandler,
    roommatesResetPasswordHandler,
}: SigninRoommatesProps) {
    const { t } = useTranslation()
    const router = useRouter()

    const form = useForm<SigninFormValues>({
        resolver: zodResolver(roommatesSigninSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    })

    const [login] = useMutation(RoommateSignIn)

    const onSubmit: SubmitHandler<SigninFormValues> = async () => {
        const { identifier, password } = form.getValues()
        const { data, errors } = await login({ variables: { input: { identifier, password } } })

        if (errors) {
            if (errors[0]?.extensions?.code === 'BAD_REQUEST') {
                if (errors[0].extensions?.errorCode === 'USER__NOT_FOUND') {
                    form.setError('identifier', { message: t('userNotFound') })
                } else if (errors[0].extensions?.errorCode === 'PASSWORD__INCORRECT') {
                    form.setError('password', { message: t('incorrectPassword') })
                } else if (errors[0]?.extensions?.errorCode === 'IDENTIFIER__INVALID:PHONE') {
                    form.setError('identifier', { message: t('enterPhone') })
                }
            }
        } else if (data?.roommateSignIn) {
            signIn(data.roommateSignIn)
            router.push('/roommates')
        }
    }
    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className=" text-center text-xl">{t('signinAsRoommates')}</div>
            <div className="h-[1px] w-full bg-slate-200"></div>
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
                                <FormLabel>{t('phoneNum')}</FormLabel>
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
                            onClick={roommatesResetPasswordHandler}
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
