import { GetPropertiesDataProps } from '@/graphql/query'
import { Language } from '@/graphql/typesGraphql'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAfter, startOfDay } from 'date-fns'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'

export const uploadPropertyInitialValues = {
    propertyTypeId: undefined,
    availableFrom: undefined,
    minRentalPeriod: undefined,
    rooms: undefined,
    bedrooms: undefined,
    bathroomsInProperty: undefined,
    bathroomsInBedroom: undefined,
    totalFloors: undefined,
    floor: undefined,
    housingStatusId: undefined,
    housingConditionId: undefined,
    street: undefined,
    cadastralCode: null,
    hideCadastralCode: false,
    propertyAmenityIds: [],
    housingHeatingTypeIds: [],
    housingLivingSafetyIds: [],
    capacity: undefined,
    petAllowed: undefined,
    partyAllowed: undefined,
    withDeposit: false,
    propertyDepositId: null,
    price: undefined,
    area: undefined,
    contactName: undefined,
    phone: undefined,
    code: undefined,
    descriptions: [
        { text: '', lang: Language.En },
        { text: '', lang: Language.Ka },
    ],
    titles: [
        { text: '', lang: Language.En },
        { text: '', lang: Language.Ka },
    ],
    imageUploadFiles: [],
}

export default function UploadValidator({ data }: { data?: GetPropertiesDataProps }) {
    const { t } = useTranslation()

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    const cadastralCodeRegex = /^\d{2}.\d{2}.\d{2}.\d{3}.\d{3}$/
    const apartmentTypeValues = data?.getPropertyTypes?.map((item) => item.id) || []
    const propertyAmenityValues = data?.getPropertyAmenities?.map((item) => item.id) || []
    const propertyHeatingValues = data?.getHousingHeatingTypes?.map((item) => item.id) || []
    const propertySafetyValues = data?.getHousingLivingSafeties?.map((item) => item.id) || []

    z.setErrorMap((issue, ctx) => {
        return { message: '' }
    })

    const titlesSchema = z.object({
        text: z
            .string()
            .min(1, { message: t('TITLE__INVALID') })
            .max(300, { message: t('TITLE__MAX') }),
        lang: z.enum([Language.En, Language.Ka]),
    })

    const descriptionSchema = z.object({
        text: z
            .string()
            .min(1, { message: t('DESCRIPTION__INVALID') })
            .max(3000, { message: t('DESCRIPTION__MAX') }),
        lang: z.enum([Language.En, Language.Ka]),
    })

    const FormSchema: z.ZodSchema = z.object({
        propertyTypeId: z.enum(apartmentTypeValues as [string, ...string[]]),
        availableFrom: z
            .string()
            .regex(dateRegex)
            .refine((value) => isAfter(value, startOfDay(new Date())), {
                message: t('AVAILABLE_FROM__MIN_DATE_TODAY'),
            }),
        minRentalPeriod: z.number().min(0),
        rooms: z.number().min(0),
        bedrooms: z.number().min(0),
        bathroomsInProperty: z.number().min(0),
        bathroomsInBedroom: z.number().min(0),
        totalFloors: z.number().int().nonnegative(),
        floor: z
            .number()
            .int()
            .nonnegative()
            .refine((value) => value <= form.getValues('totalFloors'), {
                message: t('floorExceedToTotalFloor'),
            }),
        housingStatusId: z.string().min(0),
        housingConditionId: z.string().min(0),
        street: z
            .string()
            .min(1)
            .max(300, {
                message: t('STREET__MAX'),
            }),
        cadastralCode: z
            .string()
            .refine(
                (value) => {
                    if (value === '' || value == null) return true
                    return cadastralCodeRegex.test(value)
                },
                {
                    message: t('CADASTRAL_CODE__INVALID'),
                }
            )
            .optional()
            .nullish(),
        hideCadastralCode: z.boolean().optional(),
        propertyAmenityIds: z.array(z.enum(propertyAmenityValues as [string, ...string[]])).min(1),
        housingHeatingTypeIds: z
            .array(z.enum(propertyHeatingValues as [string, ...string[]]))
            .min(1),
        housingLivingSafetyIds: z
            .array(z.enum(propertySafetyValues as [string, ...string[]]))
            .min(1),
        capacity: z.number().int().positive(),
        petAllowed: z.boolean(),
        partyAllowed: z.boolean(),
        withDeposit: z.boolean().optional(),
        propertyDepositId: z
            .string()
            .min(1)
            .nullish()
            .refine(
                (value) => {
                    if (!value && form.getValues('withDeposit')) {
                        return false
                    }

                    return true
                },
                {
                    message: t('DEPOSIT_ID__REQUIRED'),
                }
            ),
        price: z.number().positive().min(1),
        area: z.number().positive().min(1),
        contactName: z.string().min(1),
        phone: z.string().refine((value) => isValidPhoneNumber(value), {
            message: t('validNumber'),
        }),
        titles: z.array(titlesSchema).superRefine((val, ctx) => {
            val.forEach((item) => {
                const result = titlesSchema.safeParse(item)
                if (!result.success) {
                    result.error.issues.forEach((issue) => {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: issue.message,
                        })
                    })
                }
            })
        }),
        descriptions: z.array(descriptionSchema).superRefine((val, ctx) => {
            val.forEach((item) => {
                const result = descriptionSchema.safeParse(item)
                if (!result.success) {
                    result.error.issues.forEach((issue) => {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: issue.message,
                        })
                    })
                }
            })
        }),
        imageUploadFiles: z
            .array(z.any())
            .min(1, {
                message: t('IMAGES__MIN'),
            })
            .max(15, {
                message: t('IMAGES__MAX'),
            }),
        code: z.string().optional(),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: uploadPropertyInitialValues,
    })

    return form
}
