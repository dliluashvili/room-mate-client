'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form'
import UploadValidator from './validator/UploadValidator'
import StaticRentDatePicker from './formFieldItems/StaticRentDatePicker'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@apollo/client'
import { GetPropertiesData } from '@/graphql/query'
import { useParams } from 'next/navigation'
import FullDynamicToggle from './formFieldItems/FullDynamicToggle'
import StaticRentMonthSelect from './formFieldItems/StaticRentMonthSelect'
import StaticNumericToggle from './formFieldItems/StaticNumericToggle'
import StaticSelectNumeric from './formFieldItems/StaticSelectNumeric'
import FullDynamicSelect from './formFieldItems/FullDynamicSelect'
import { Input } from '@/src/components/ui/input'
import { Checkbox } from '@/src/components/ui/checkbox'
import FullDynamicCheckbox from './formFieldItems/FullDynamicCheckbox'
import StaticPetStatusRadio from './formFieldItems/StaticPetStatusRadio'
import StaticPartyStatusRadio from './formFieldItems/StaticPartyStatusRadio'
import StaticDepositRadio from './formFieldItems/StaticDepositRadio'
import MultiImageUploader from './formFieldItems/MultiImageUploader'
import { SendCodeBySms, UpsertProperty, VerifyCodeBySms } from '@/graphql/mutation'
import { Button } from '@/src/components/ui/button'
import { CodePurpose, VerificationCodeValidityStatus } from '@/graphql/typesGraphql'
import { useEffect, useState } from 'react'
import DescriptionTextarea from './formFieldItems/DescriptionTextarea'
import TitleTextarea from './formFieldItems/TitleTextarea'
import Loading from '../../../loading'
import { withAuth } from '@/src/auth/withAuth'
import { UploadDialog } from './dialogWindow/UploadDialog'
import PhoneInput, { Value as E164Number } from 'react-phone-number-input'
import { isEmpty } from '@/src/utils/isEmpty'
import FullDynamicSelectDeposit from './formFieldItems/FullyDynamicSelectDeposit copy'
import AddressTextArea from './formFieldItems/AddressTextArea'

function ClientWrapper() {
    const [getCodeButtonClicked, setGetCodeButtonClicked] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const params = useParams()
    const locale = params.locale

    const { t } = useTranslation()

    const [uploadProperty] = useMutation(UpsertProperty)

    const [smsSend] = useMutation(SendCodeBySms, {
        fetchPolicy: 'network-only',
    })

    const [smsCheck] = useMutation(VerifyCodeBySms, {
        fetchPolicy: 'network-only',
    })

    const { data } = useQuery(GetPropertiesData, {
        variables: { locale: locale },
        fetchPolicy: 'no-cache',
    })

    const form = UploadValidator({
        data,
    })

    const {
        trigger,
        formState: { isValid },
        getValues,
        setError,
        watch,
        setValue,
        control,
        handleSubmit,
    } = form

    const getCodeHandler = async () => {
        const isValid = await trigger('phone')

        if (!isValid) {
            setOpenAlert(true)
            setAlertMessage('validNumber')
        } else {
            setGetCodeButtonClicked(true)

            const { data: smsSendData, errors } = await smsSend({
                variables: {
                    input: {
                        phone: getValues('phone') ?? '',
                        codePurpose: CodePurpose.LandlordUploadApartment,
                    },
                },
            })

            if (errors?.length) {
                const sendFailed = errors.find(
                    (error) => error?.extensions?.code === 'INTERNAL_SERVER_ERROR'
                )

                if (sendFailed) {
                    setAlertMessage(t('SMS__SENDING_FAILED'))
                    setOpenAlert(true)
                }
            }

            if (smsSendData?.sendCodeBySms?.status === 'ALREADY_SENT') {
                setError('code', { message: t('codeAlreadySent') })
            }
        }
    }

    const onSubmit = async () => {
        if (isSubmitting) return // Prevent multiple submissions

        setIsSubmitting(true)
        try {
            const { data: codeData, errors: codeErrors } = await smsCheck({
                variables: {
                    input: {
                        phone: watch('phone') ?? '',
                        code: getValues('code') ?? '',
                        codePurpose: CodePurpose.LandlordUploadApartment,
                    },
                },
            })

            if (
                codeErrors ||
                codeData?.verifyCodeBySms?.status !== VerificationCodeValidityStatus.Valid
            ) {
                setError('code', { message: t('invalidCode') })
            } else {
                const formValues = getValues()
                const withDeposit = formValues.propertyDepositId ? true : formValues.withDeposit

                const { data, errors } = await uploadProperty({
                    variables: {
                        input: {
                            id: null,
                            withDeposit: withDeposit,
                            totalFloors: getValues('totalFloors'),
                            floor: getValues('floor'),
                            titles: getValues('titles'),
                            streets: getValues('street'),

                            rooms: getValues('rooms'),
                            bedrooms: getValues('bedrooms'),
                            propertyTypeId: getValues('propertyTypeId'),
                            propertyDepositId: getValues('propertyDepositId'),
                            propertyAmenityIds: getValues('propertyAmenityIds'),
                            price: getValues('price'),
                            petAllowed: getValues('petAllowed'),
                            partyAllowed: getValues('partyAllowed'),
                            minRentalPeriod: getValues('minRentalPeriod'),
                            imageUploadFiles: getValues('imageUploadFiles'),
                            housingStatusId: getValues('housingStatusId'),
                            housingLivingSafetyIds: getValues('housingLivingSafetyIds'),
                            housingHeatingTypeIds: getValues('housingHeatingTypeIds'),
                            housingConditionId: getValues('housingConditionId'),
                            hideCadastralCode: getValues('hideCadastralCode'),
                            descriptions: getValues('descriptions'),
                            contactPhone: getValues('phone'),
                            contactName: getValues('contactName'),
                            capacity: getValues('capacity'),
                            cadastralCode: isEmpty(getValues('cadastralCode'))
                                ? null
                                : getValues('cadastralCode'),
                            bathroomsInProperty: getValues('bathroomsInProperty'),
                            bathroomsInBedroom: getValues('bathroomsInBedroom'),
                            availableFrom: getValues('availableFrom'),
                            area: getValues('area'),
                            heatingSafetyChecked: getValues('heatingSafetyChecked'),
                            districtId: getValues('districtId'),
                        },
                    },
                })
                if (data?.upsertProperty) {
                    setOpenAlert(true)
                    setAlertMessage('success')
                }
                if (errors?.length) {
                    setOpenAlert(true)
                    setAlertMessage(t('canNotUpload'))
                }
            }
        } catch (error) {
            console.error('Error during submission:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const checkErrorsHandler = async () => {
        await trigger()
        if (!isValid) {
            setOpenAlert(true)
            setAlertMessage('requiredFields')
        }
    }

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'withDeposit' && value.withDeposit === false) {
                setValue('propertyDepositId', null, { shouldValidate: true })
                trigger('propertyDepositId')
            }
            if (name === 'totalFloors' && typeof value.floor === 'number') {
                trigger(['floor'])
            }
        })

        return () => subscription.unsubscribe()
    }, [watch, setValue, trigger])

    return (
        <>
            {openAlert && (
                <UploadDialog
                    setOpenAlert={setOpenAlert}
                    openAlert={openAlert}
                    alertMessage={alertMessage}
                />
            )}

            <main className="m-auto flex min-h-screen w-full flex-col items-center justify-start overflow-hidden px-6 py-10 sm:px-16 md:max-w-[770px]">
                {!data ? (
                    <Loading />
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex h-full w-full flex-col gap-6 overflow-auto rounded-md"
                        >
                            <FormField
                                control={control}
                                name="propertyTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('apartmentType')}</FormLabel>
                                        <FullDynamicToggle
                                            field={field}
                                            data={data?.getPropertyTypes}
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="availableFrom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs md:text-sm">
                                            {t('availableFrom')}
                                        </FormLabel>
                                        <FormControl>
                                            <StaticRentDatePicker field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="minRentalPeriod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs md:text-sm">
                                            {t('minRentMonth')}
                                        </FormLabel>
                                        <FormControl>
                                            <StaticRentMonthSelect field={field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="rooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('apartmentRooms')}</FormLabel>
                                        <StaticNumericToggle field={field} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="bedrooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('apartmentBedrooms')}</FormLabel>
                                        <StaticNumericToggle field={field} />
                                    </FormItem>
                                )}
                            />
                            <div className="flex w-full flex-col">
                                <FormLabel>{t('bathroomsAmount')}</FormLabel>
                                <div className="mt-2 flex w-full flex-row gap-4">
                                    <FormField
                                        control={control}
                                        name="bathroomsInProperty"
                                        render={({ field }) => (
                                            <FormItem className="md:w-1/2">
                                                <FormLabel className="text-xs md:text-sm">
                                                    {t('inApartment')}
                                                </FormLabel>
                                                <FormControl>
                                                    <StaticSelectNumeric field={field} amount={5} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name="bathroomsInBedroom"
                                        render={({ field }) => (
                                            <FormItem className="md:w-1/2">
                                                <FormLabel className="text-xs md:text-sm">
                                                    {t('inBedroom')}
                                                </FormLabel>
                                                <FormControl>
                                                    <StaticSelectNumeric field={field} amount={2} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full flex-row items-start gap-4">
                                <FormField
                                    control={control}
                                    name="totalFloors"
                                    render={({ field }) => (
                                        <FormItem className="md:w-1/2">
                                            <FormLabel className="text-sm md:text-base">
                                                {t('floorAmount')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    min="0"
                                                    type="number"
                                                    onWheel={(event) => event.currentTarget.blur()}
                                                    className="h-10 w-full md:w-28"
                                                    onChange={(e) =>
                                                        field.onChange(Number(e.target.value))
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="floor"
                                    render={({ field }) => (
                                        <FormItem className="md:w-1/2">
                                            <FormLabel className="text-sm md:text-base">
                                                {t('flatFloor')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    min="0"
                                                    type="number"
                                                    onWheel={(event) => event.currentTarget.blur()}
                                                    className="h-10 w-full md:w-28"
                                                    onChange={(e) =>
                                                        field.onChange(Number(e.target.value))
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-4 md:flex-row">
                                <FormField
                                    control={control}
                                    name="housingStatusId"
                                    render={({ field }) => (
                                        <FormItem className="md:w-1/2">
                                            <FormLabel className="text-sm md:text-base">
                                                {t('status')}
                                            </FormLabel>
                                            <FormControl>
                                                <FullDynamicSelect
                                                    field={field}
                                                    data={data?.getHousingStatuses}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="housingConditionId"
                                    render={({ field }) => (
                                        <FormItem className="md:w-1/2">
                                            <FormLabel className="flex w-full justify-start  text-sm">
                                                {t('condition')}
                                            </FormLabel>
                                            <FormControl>
                                                <FullDynamicSelect
                                                    field={field}
                                                    data={data?.getHousingConditions}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={control}
                                name="districtId"
                                render={({ field }) => (
                                    <FormItem className="md:w-1/2">
                                        <FormLabel className="text-sm md:text-base">
                                            {t('district')}
                                        </FormLabel>
                                        <FormControl>
                                            <FullDynamicSelect
                                                field={field}
                                                data={data?.getDistricts}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <AddressTextArea form={form} />
                            <FormField
                                control={control}
                                name="cadastralCode"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t('cadastralCode')}</FormLabel>
                                        <span className="text-xs text-[#838CAC] ">
                                            {t('cadastralDetails')}
                                        </span>
                                        <FormControl>
                                            <Input
                                                min="0"
                                                className="mt-2 h-10 text-xs md:text-sm"
                                                onChange={(value) => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <FormField
                                            control={control}
                                            name="hideCadastralCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                field={field}
                                                                onCheckedChange={(checked) =>
                                                                    field.onChange(checked)
                                                                }
                                                            />
                                                            <label className=" text-xs font-medium leading-none text-[#838CAC] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                {t('hideCadastralCode')}
                                                            </label>
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="propertyAmenityIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('propertyAmenities')}</FormLabel>
                                        <FormControl>
                                            <FullDynamicCheckbox
                                                field={field}
                                                data={data?.getPropertyAmenities}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="housingHeatingTypeIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('propertyHeating')}</FormLabel>
                                        <FormControl>
                                            <FullDynamicCheckbox
                                                field={field}
                                                data={data?.getHousingHeatingTypes}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="housingLivingSafetyIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('propertySafety')}</FormLabel>
                                        <FormControl>
                                            <FullDynamicCheckbox
                                                field={field}
                                                data={data?.getHousingLivingSafeties}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('maxPersonLiving')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                min="0"
                                                type="number"
                                                onWheel={(event) => event.currentTarget.blur()}
                                                className="h-10 w-full md:w-28"
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="petAllowed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('petStatus')}</FormLabel>
                                        <FormControl>
                                            <StaticPetStatusRadio field={field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="partyAllowed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('partyStatus')}</FormLabel>
                                        <FormControl>
                                            <StaticPartyStatusRadio field={field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex w-full flex-col gap-4 md:flex-row">
                                <FormField
                                    control={control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('area')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    min="0"
                                                    step="any"
                                                    type="number"
                                                    onWheel={(event) => event.currentTarget.blur()}
                                                    className="h-10 w-full md:w-40"
                                                    onChange={(event) =>
                                                        field.onChange(
                                                            parseFloat(event.target.value)
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('price')}</FormLabel>
                                            <div className="flex w-full flex-row items-center gap-2 md:gap-0">
                                                <FormControl>
                                                    <Input
                                                        min="0"
                                                        step="any"
                                                        type="number"
                                                        onWheel={(event) =>
                                                            event.currentTarget.blur()
                                                        }
                                                        className="h-10 w-full md:w-40"
                                                        onChange={(event) => {
                                                            field.onChange(
                                                                parseFloat(event.target.value)
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-mainGreen text-base text-white md:w-11">
                                                    $
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="relative flex w-full flex-col items-start gap-4 md:w-full md:flex-row">
                                <FormField
                                    control={control}
                                    name="withDeposit"
                                    render={({ field }) => (
                                        <FormItem className="md:w-full lg:w-full">
                                            <FormControl className="w-full">
                                                <StaticDepositRadio field={field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex w-full flex-row items-center self-end">
                                    <FormField
                                        control={control}
                                        name="propertyDepositId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex">
                                                    <FormControl>
                                                        <FullDynamicSelectDeposit
                                                            field={field}
                                                            form={form}
                                                            data={data?.getPropertyDeposits}
                                                        />
                                                    </FormControl>
                                                    <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-md bg-mainGreen text-base text-white md:w-9">
                                                        $
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <TitleTextarea form={form} />
                            <DescriptionTextarea form={form} />

                            <FormField
                                control={control}
                                name="imageUploadFiles"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('apartmentImage')}</FormLabel>
                                        <MultiImageUploader field={field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex w-full flex-col gap-4">
                                <FormLabel>{t('contactInfo')}</FormLabel>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <FormField
                                        control={control}
                                        name="contactName"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-full">
                                                <FormLabel className="text-xs md:text-sm">
                                                    {t('name')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="h-[38px] w-full"
                                                        onChange={(value) => field.onChange(value)}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-full">
                                                <FormLabel className="text-xs md:text-sm">
                                                    {t('phone')}
                                                </FormLabel>
                                                <FormControl>
                                                    <PhoneInput
                                                        className="w-full"
                                                        defaultCountry="GE"
                                                        international
                                                        value={field?.value}
                                                        labels={undefined}
                                                        form={form}
                                                        onChange={(contactPhone: E164Number) => {
                                                            field.onChange(contactPhone)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs md:text-sm">
                                                    {t('fillCode')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        value={field.value}
                                                        getCode
                                                        setPhoneFormat={undefined}
                                                        getCodeButtonClicked={getCodeButtonClicked}
                                                        onGetCodeClick={getCodeHandler}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <FormField
                                control={control}
                                name="heatingSafetyChecked"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    field={field}
                                                    onCheckedChange={(checked) =>
                                                        field.onChange(checked)
                                                    }
                                                />
                                                <label className=" text-xs font-medium leading-none text-[#838CAC] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {t('safetyCheck')}
                                                </label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                onClick={checkErrorsHandler}
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full"
                            >
                                {t('upload')}
                            </Button>
                        </form>
                    </Form>
                )}
            </main>
        </>
    )
}

export default withAuth(ClientWrapper)
