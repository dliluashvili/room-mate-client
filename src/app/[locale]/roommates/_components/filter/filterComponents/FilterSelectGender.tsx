import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Language } from '@/graphql/typesGraphql'
import Select from '@/src/components/ui/select'
import { useQuery } from '@apollo/client'
import { GetGenders } from '@/graphql/query'
import { useParams, useSearchParams } from 'next/navigation'
import { ActionMeta } from 'react-select'

type Option = { value: string; label: string }
type GenderProps = {
    columnName: string
    data: string | string[]
}

type FilterSelectGenderProps = {
    gender: GenderProps[]
    setGender: Dispatch<SetStateAction<GenderProps[]>>
}

export default function FilterSelectGender({ gender, setGender }: FilterSelectGenderProps) {
    const { t } = useTranslation()
    const params = useParams()
    const searchParams = useSearchParams()
    const locale = params.locale as Language

    const [selectedValue, setSelectedValue] = useState<Option | null>(null)

    const { data, loading, error } = useQuery(GetGenders, {
        variables: { locale },
    })

    useEffect(() => {
        const updateSelectedValue = (genderId: string) => {
            if (data?.getGenders) {
                const matchedGender = data.getGenders.find((g) => g.id === genderId)
                if (matchedGender) {
                    setSelectedValue({
                        value: matchedGender.id,
                        label: matchedGender.translations[0].sex,
                    })
                }
            }
        }

        // Check URL parameters first
        const urlGenderId = searchParams.get('answer[0][data]')
        if (urlGenderId && searchParams.get('answer[0][columnName]') === 'gender_id') {
            updateSelectedValue(urlGenderId)
        } else {
            // If not in URL, check the gender prop
            const matchingGender = gender.find((item) => item.columnName === 'gender_id')
            if (matchingGender) {
                updateSelectedValue(matchingGender.data as string)
            } else {
                setSelectedValue(null)
            }
        }
    }, [gender, data, searchParams])

    const handleSelectChange = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
        const selectedOption = newValue as Option | null

        if (selectedOption) {
            setGender((prevGender) => {
                const existingIndex = prevGender.findIndex(
                    (item) => item.columnName === 'gender_id'
                )
                if (existingIndex !== -1) {
                    const updatedGender = [...prevGender]
                    updatedGender[existingIndex] = {
                        columnName: 'gender_id',
                        data: selectedOption.value,
                    }
                    return updatedGender
                } else {
                    return [...prevGender, { columnName: 'gender_id', data: selectedOption.value }]
                }
            })
        } else {
            setGender((prevGender) => prevGender.filter((item) => item.columnName !== 'gender_id'))
        }
        setSelectedValue(selectedOption)
    }
    if (loading) return <div>{t('loading')}</div>
    if (error) return <div>{t('error')}</div>

    return (
        <>
            <label className="w-full text-sm">{t('gender')}</label>
            <Select
                className="mt-2 w-full cursor-pointer text-sm"
                placeholder={t('select')}
                value={selectedValue}
                options={
                    data?.getGenders
                        ? data.getGenders.map((gender) => ({
                              value: gender.id,
                              label: gender.translations[0].sex,
                          }))
                        : []
                }
                onChange={handleSelectChange}
            />
        </>
    )
}
