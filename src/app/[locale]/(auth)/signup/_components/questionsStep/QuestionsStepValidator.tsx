/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import 'react-phone-number-input/style.css'
import { QuestionObject } from '@/graphql/typesGraphql'

type StepTwoValidatorProps = {
    formData: any
    questions?: QuestionObject[] | null
}

export default function QuestionsStepValidator({ questions, formData }: StepTwoValidatorProps) {
    const optionSchema = z.object({
        questionId: z.string().min(1),
        value: z.string().min(1),
        label: z.string().min(1),
    })

    const formSchema = z.object(
        questions &&
            questions.reduce((acc: any, item) => {
                if (item.uiFieldInfo) {
                    let fieldSchema
                    if (item.uiFieldInfo.input.variant === 'multiple') {
                        if (item.uiFieldInfo.input) {
                            //Must set required type
                            fieldSchema = z.array(optionSchema).min(1)
                        } else {
                            fieldSchema = z.array(optionSchema).optional()
                        }
                    } else if (item.uiFieldInfo.input.variant === 'single') {
                        if (item.uiFieldInfo.input) {
                            //Must set required type
                            fieldSchema = optionSchema.refine((obj) => Object.keys(obj).length >= 1)
                        } else {
                            fieldSchema = optionSchema.optional()
                        }
                    } else if (item.uiFieldInfo.input.variant === 'calendar') {
                        if (item.uiFieldInfo.input) {
                            //Must set required type
                            fieldSchema = z.array(z.string()).min(1)
                        } else {
                            fieldSchema = z.array(z.string()).optional()
                        }
                    } else if (
                        item.uiFieldInfo.input.type === 'text' ||
                        item.uiFieldInfo.input.type === 'numeric' ||
                        item.uiFieldInfo.input.type === 'textarea'
                    ) {
                        if (item.uiFieldInfo.input) {
                            //Must set required type
                            fieldSchema = z.string().min(1)
                        } else {
                            fieldSchema = z.string().min(0)
                        }
                    }

                    acc[item.id] = fieldSchema
                }

                return acc
            }, {})
    )

    const defaultValues = {
        ...questions?.reduce((acc: any, item) => {
            if (item.uiFieldInfo) {
                if (formData.answeredQuestions && item.uiFieldInfo.input.variant === 'multiple') {
                    acc[item?.id] = formData.answeredQuestions[item.id] || undefined
                } else if (
                    formData.answeredQuestions &&
                    item.uiFieldInfo.input.variant === 'single'
                ) {
                    acc[item.id] = formData.answeredQuestions[item.id]
                        ? formData.answeredQuestions[item.id]
                        : null
                } else if (
                    formData.answeredQuestions &&
                    item.uiFieldInfo.input.variant === 'calendar'
                ) {
                    acc[item.id] = formData.answeredQuestions[item.id]
                        ? formData.answeredQuestions[item.id]
                        : []
                } else {
                    acc[item.id] =
                        (formData.answeredQuestions && formData.answeredQuestions[item.id]) || ''
                }
            }
            return acc
        }, {}),
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })
    return form
}
