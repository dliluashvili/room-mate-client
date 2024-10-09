'use client'
import { useParams } from 'next/navigation'
import { UserProfileStepValidator } from './UserProfileStepValidator'
import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'

import {
    CodePurpose,
    CountryObject,
    GenderObject,
    Language,
    VerificationCodeValidityStatus,
} from '@/graphql/typesGraphql'
import { getCountriesQuery, getGendersQuery } from '@/graphql/query'
import Image from 'next/legacy/image'
import PhoneInput from '@/src/components/shared/phoneInput/PhoneInput'
import Select from '@/src/components/ui/select'
import ImageUploader from '../imageUploader/ImageUploader'
import { FormDataProps } from '../../types'
import { SendCodeBySms, VerifyCodeBySms } from '@/graphql/mutation'
import Reactdatepicker from '@/src/components/shared/datePicker/TestDatePicker'

type StepOneProps = {
    formData?: FormDataProps
    setStep: Dispatch<SetStateAction<number>>
    updateFormData: (newData: Partial<FormDataProps>) => void
}

export default function UserProfileStep({ formData, setStep, updateFormData }: StepOneProps) {
    const [getCodeButtonClicked, setGetCodeButtonClicked] = useState(false)
    const [phoneFormat, setPhoneFormat] = useState(false)

    const params = useParams()
    const locale = params.locale as Language

    const { t } = useTranslation()

    const form = UserProfileStepValidator({ formData })

    const [smsCheck] = useMutation(VerifyCodeBySms, {
        fetchPolicy: 'network-only',
    })
    const [smsSend] = useMutation(SendCodeBySms, {
        fetchPolicy: 'network-only',
    })
    const { data: countries } = useQuery(getCountriesQuery, {
        variables: {
            locale: locale,
        },
    })
    const { data: genders } = useQuery(getGendersQuery, {
        variables: {
            locale: locale,
        },
    })

    const gendersSelectOptions = genders?.getGenders?.map((gender: GenderObject) => ({
        value: gender.id,
        label: gender?.translations[0].sex,
    }))

    const countrySelectOptions = countries?.getCountries
        ?.slice()
        .sort((a: CountryObject, b: CountryObject) => {
            if (a.position === 1) return -1
            if (b.position === 1) return 1
            return 0
        })
        .map((country: CountryObject) => ({
            value: country.id,
            label: (
                <div key={country.id} className="flex w-full items-center gap-1">
                    <Image
                        src={`https://flagcdn.com/${country.alpha2Code.toLowerCase()}.svg`}
                        width={22}
                        height={16}
                        alt={country?.translations?.[0]?.name || 'Country flag'}
                        priority={false}
                        className="h-auto w-auto"
                    />
                    {country?.translations?.[0]?.name}
                </div>
            ),
        }))

    const handleSubmit = async (data: { code: string }) => {
        updateFormData(data)
        const { data: responseData } = await smsCheck({
            variables: {
                input: {
                    phone: form.watch('phone') ?? '',
                    code: data.code,
                    codePurpose: CodePurpose.RoommateSignUp,
                },
            },
        })
        if (responseData?.verifyCodeBySms?.status === VerificationCodeValidityStatus.Valid) {
            setStep(2)
        } else if (
            responseData?.verifyCodeBySms?.status === VerificationCodeValidityStatus.Invalid
        ) {
            form.setError('code', { message: t('codeExpired') })
        } else if (
            responseData?.verifyCodeBySms?.status === VerificationCodeValidityStatus.NotFound
        ) {
            form.setError('code', { message: t('incorrectCode') })
        } else {
            form.setError('code', { message: t('fillCode') })
        }
    }

    const getCodeHandler = () => {
        form.handleSubmit(async () => {
            setGetCodeButtonClicked(true)

            const { data } = await smsSend({
                variables: {
                    input: {
                        phone: form.watch('phone') ?? '',
                        codePurpose: CodePurpose.RoommateSignUp,
                    },
                },
            })
            if (data?.sendCodeBySms?.status === 'ALREADY_SENT') {
                form.setError('code', { message: t('codeAlreadySent') })
            }
        })()
    }

    return (
        <>
            <main className="flex flex-col items-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
                        <div className="mb-3 grid grid-cols-1 items-start gap-x-6 gap-y-6 md:grid-cols-2 lg:justify-center">
                            <FormField
                                control={form.control}
                                name="firstname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('name')}</FormLabel>

                                        <Input
                                            type="string"
                                            {...field}
                                            value={field.value}
                                            hasError={
                                                !!form.formState.errors.firstname &&
                                                form.formState.dirtyFields.firstname
                                            }
                                            isSuccess={
                                                !form.formState.errors.firstname &&
                                                form.formState.dirtyFields.firstname
                                            }
                                            onChange={(e) => {
                                                field.onChange(e)
                                                form.trigger('firstname')
                                            }}
                                        />
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
                                            type="string"
                                            {...field}
                                            value={field.value}
                                            hasError={
                                                !!form.formState.errors.lastname &&
                                                form.formState.dirtyFields.lastname
                                            }
                                            isSuccess={
                                                !form.formState.errors.lastname &&
                                                form.formState.dirtyFields.lastname
                                            }
                                            onChange={(e) => {
                                                field.onChange(e)
                                                form.trigger('lastname')
                                            }}
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="countryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('country')}</FormLabel>
                                        <Select
                                            {...field}
                                            placeholder={t('selectCountry')}
                                            onChange={(value) => {
                                                field.onChange(value)
                                            }}
                                            options={countrySelectOptions}
                                            filterOption={(option: any, inputValue) =>
                                                option.label.props.children[1]
                                                    .toLowerCase()
                                                    .startsWith(inputValue.toLowerCase())
                                            }
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="genderId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('gender')}</FormLabel>
                                        <Select
                                            {...field}
                                            placeholder={t('selectGender')}
                                            onChange={(value) => {
                                                field.onChange(value)
                                            }}
                                            options={gendersSelectOptions}
                                        />
                                    </FormItem>
                                )}
                            />

                            {/* <FormField
                                control={form.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('age')}</FormLabel>
                                        <DatePicker field={field} />
                                        {field.value !== undefined && field.value !== '' && (
                                            <FormMessage />
                                        )}
                                    </FormItem>
                                )}
                            /> */}
                            <FormField
                                control={form.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('age')}</FormLabel>
                                        <Reactdatepicker field={field} />
                                        {field.value !== undefined && field.value !== '' && (
                                            <FormMessage />
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('mail')}</FormLabel>
                                        <Input
                                            type="email"
                                            placeholder={t('optional')}
                                            {...field}
                                            value={field.value}
                                            hasError={
                                                !!form.formState.errors.email &&
                                                form.formState.dirtyFields.email
                                            }
                                            isSuccess={
                                                !form.formState.errors.email &&
                                                form.formState.dirtyFields.email
                                            }
                                            onChange={(e) => {
                                                field.onChange(e)
                                                form.trigger('email')
                                            }}
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Password')}</FormLabel>
                                        <Input
                                            type="password"
                                            {...field}
                                            value={field.value}
                                            hasError={
                                                !!form.formState.errors.password &&
                                                form.formState.dirtyFields.password
                                            }
                                            isSuccess={
                                                !form.formState.errors.password &&
                                                form.formState.dirtyFields.password
                                            }
                                            onChange={(e) => {
                                                field.onChange(e)
                                                form.trigger('password')
                                            }}
                                        />

                                        {field.value !== undefined && field.value !== '' && (
                                            <FormMessage />
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('PasswordRepeat')}</FormLabel>

                                        <Input
                                            type="password"
                                            {...field}
                                            value={field.value}
                                            hasError={
                                                !!form.formState.errors.confirmPassword &&
                                                form.formState.dirtyFields.confirmPassword
                                            }
                                            isSuccess={
                                                !form.formState.errors.confirmPassword &&
                                                form.formState.dirtyFields.confirmPassword
                                            }
                                            onChange={(e) => {
                                                field.onChange(e)
                                                form.trigger('confirmPassword')
                                            }}
                                        />

                                        {field.value !== undefined && field.value !== '' && (
                                            <FormMessage />
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="profileImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('profileImage')}</FormLabel>
                                        <ImageUploader field={field} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Phonenumber')}</FormLabel>
                                        <div onClick={() => setPhoneFormat(false)}>
                                            <PhoneInput
                                                type="number"
                                                field={field}
                                                labels={undefined}
                                                defaultCountry="GE"
                                                international
                                                value={field.value}
                                                form={form}
                                                onChange={(phone: string) => {
                                                    form.setValue('phone', phone)
                                                }}
                                            />
                                        </div>
                                        {phoneFormat &&
                                        field.value !== undefined &&
                                        field.value !== '' ? (
                                            <FormMessage />
                                        ) : null}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('fillCode')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                value={field.value}
                                                getCode
                                                setPhoneFormat={setPhoneFormat}
                                                getCodeButtonClicked={getCodeButtonClicked}
                                                onGetCodeClick={getCodeHandler}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            onClick={() => setPhoneFormat(true)}
                            className="mt-4 w-full"
                            size="lg"
                            type="submit"
                        >
                            {t('next')}
                        </Button>
                    </form>
                </Form>
            </main>
        </>
    )
}
