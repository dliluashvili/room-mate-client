'use client'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/src/components/ui/card'
import { SignupAlert } from './popups/SignupAlert'
import SignupHeader from './header/SignupHeader'
import QuestionsStep from './questionsStep/QuestionsStep'
import UserProfileStep from './userProfileStep/UserProfileStep'
import Loading from '../loading'

import {
    CombinedAnsweredQuestions,
    CustomError,
    FormDataProps,
    NewAnsweredQuestion,
} from '../types'
import { RoommateSignUpMutation } from '@/graphql/mutation'

import { signIn } from '@/src/auth/signIn'

export default function ClientWrapper() {
    const [step, setStep] = useState(1)
    const [alertIsOpen, setAlertIsOpen] = useState(false)
    const [alertType, setAlertType] = useState('')
    const [isClient, setIsClient] = useState(false)
    const [formData, setFormData] = useState<FormDataProps>()

    const router = useRouter()

    const { t } = useTranslation()

    const [signUp] = useMutation(RoommateSignUpMutation, {
        fetchPolicy: 'network-only',
    })

    const updateFormData = (newData: Partial<FormDataProps>) => {
        setFormData((prevData) =>
            prevData ? { ...prevData, ...newData } : (newData as FormDataProps)
        )
    }

    const submit = async () => {
        if (!formData) return

        const modifiedFormData = { ...formData } as FormDataProps

        delete modifiedFormData.code

        if (typeof modifiedFormData.countryId === 'object' && modifiedFormData.countryId !== null) {
            modifiedFormData.countryId = Number(modifiedFormData.countryId?.value)
        }
        if (typeof modifiedFormData.genderId === 'object' && modifiedFormData.genderId !== null) {
            modifiedFormData.genderId = Number(modifiedFormData.genderId.value)
        }

        if (
            Array.isArray(modifiedFormData.profileImage) &&
            modifiedFormData.profileImage[0] !== undefined
        ) {
            modifiedFormData.profileImage = modifiedFormData.profileImage[0].base64
        } else {
            delete modifiedFormData.profileImage
        }

        if (modifiedFormData?.email === '' || modifiedFormData.email === undefined) {
            delete modifiedFormData.email
        }

        if (modifiedFormData.answeredQuestions) {
            const newAnsweredQuestions: NewAnsweredQuestion[] = []

            for (const key in modifiedFormData.answeredQuestions as CombinedAnsweredQuestions) {
                const value = (modifiedFormData.answeredQuestions as CombinedAnsweredQuestions)[key]
                if (typeof value === 'string') {
                    newAnsweredQuestions.push({ questionId: key, data: value })
                } else if (Array.isArray(value)) {
                    if (Array.isArray(value) && typeof value[0] === 'object') {
                        const questionId = value[0]['questionId']
                        const answerIds = value.map((item) => item['value'])

                        newAnsweredQuestions.push({
                            questionId,
                            answerIds,
                        })
                    } else {
                        newAnsweredQuestions.push({
                            questionId: key,
                            dataRange: value,
                        })
                    }
                } else if (typeof value === 'object' && !Array.isArray(value)) {
                    newAnsweredQuestions.push({
                        questionId: value['questionId'],
                        answerIds: [value['value']],
                    })
                }
            }

            try {
                const input = {
                    answeredQuestions: newAnsweredQuestions,
                    countryId: modifiedFormData.countryId as number,
                    genderId: modifiedFormData.genderId as number,
                    email: modifiedFormData.email!,
                    phone: modifiedFormData.phone!,
                    birthDate: modifiedFormData.birthDate,
                    profileImage: modifiedFormData.profileImage,
                    firstname: modifiedFormData.firstname!,
                    lastname: modifiedFormData.lastname!,
                    password: modifiedFormData.password!,
                    confirmPassword: modifiedFormData.confirmPassword!,
                }

                if (modifiedFormData.profileImage) {
                    input.profileImage = modifiedFormData.profileImage as string
                }

                const { data } = await signUp({
                    variables: {
                        input,
                    },
                })

                if (data?.roommateSignUp.jwt) {
                    signIn(data.roommateSignUp.jwt)
                    router.push('/roommates')
                }
            } catch (error: unknown | CustomError) {
                setAlertIsOpen(true)
                if ((error as CustomError)?.message === 'PHONE_EXISTS') {
                    setAlertType('PHONE_EXISTS')
                } else if ((error as CustomError)?.message === 'EMAIL_EXISTS') {
                    setAlertType('EMAIL_EXISTS')
                } else {
                    setAlertType('ERROR')
                }
            }
        }
    }

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <>
            <SignupAlert
                alertIsOpen={alertIsOpen}
                alertType={alertType}
                setAlertIsOpen={setAlertIsOpen}
            />
            <main className="flex h-auto w-full flex-col items-center justify-center px-6 md:px-[10%] md:pb-16 lg:px-[15%] xl:px-[334px]">
                <SignupHeader step={step} />

                <Card className="w-full">
                    {isClient ? (
                        <CardContent className="relative h-full w-full bg-white px-6 pb-16 pt-8 sm:px-14">
                            {step === 1 && (
                                <UserProfileStep
                                    setStep={setStep}
                                    formData={formData}
                                    updateFormData={updateFormData}
                                />
                            )}

                            {step === 2 && (
                                <QuestionsStep
                                    step={step}
                                    updateFormData={updateFormData}
                                    submit={submit}
                                    setStep={setStep}
                                    formData={formData}
                                    next={t('next')}
                                />
                            )}
                            {step === 3 && (
                                <QuestionsStep
                                    step={step}
                                    updateFormData={updateFormData}
                                    submit={submit}
                                    setStep={setStep}
                                    formData={formData}
                                    next={t('submit')}
                                />
                            )}
                        </CardContent>
                    ) : (
                        <Loading />
                    )}
                </Card>
            </main>
        </>
    )
}
