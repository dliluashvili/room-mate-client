import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { getDaysInMonth, parse, isValid, format } from 'date-fns'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/shadcnSelect'

const georgianMonths = [
    'იანვარი',
    'თებერვალი',
    'მარტი',
    'აპრილი',
    'მაისი',
    'ივნისი',
    'ივლისი',
    'აგვისტო',
    'სექტემბერი',
    'ოქტომბერი',
    'ნოემბერი',
    'დეკემბერი',
]

const englishMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

interface BirthDatePickerProps {
    field: {
        value: string
        onChange: (value: string) => void
    }
    step: number
}

function BirthDatePicker({ field, step }: BirthDatePickerProps) {
    const { t } = useTranslation()
    const params = useParams()
    const locale = params.locale as string

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    useEffect(() => {
        if (field.value) {
            const date = parse(field.value, 'yyyy-MM-dd', new Date())
            if (isValid(date)) {
                setSelectedDate(date)
            } else {
                setSelectedDate(null)
            }
        } else {
            setSelectedDate(null)
        }
    }, [field.value])

    const handleYearChange = (value: string) => {
        updateDate(Number(value), selectedDate?.getMonth() ?? 0, selectedDate?.getDate() ?? 1)
    }

    const handleMonthChange = (value: string) => {
        const month = Number(value) - 1 // JavaScript months are 0-indexed
        updateDate(
            selectedDate?.getFullYear() ?? new Date().getFullYear(),
            month,
            selectedDate?.getDate() ?? 1
        )
    }

    const handleDayChange = (value: string) => {
        updateDate(
            selectedDate?.getFullYear() ?? new Date().getFullYear(),
            selectedDate?.getMonth() ?? 0,
            Number(value)
        )
    }

    const updateDate = (year: number, month: number, day: number) => {
        const newDate = new Date(year, month, day)
        if (isValid(newDate)) {
            setSelectedDate(newDate)
            field.onChange(format(newDate, 'yyyy-MM-dd'))
        } else {
            setSelectedDate(null)
            field.onChange('')
        }
    }

    const currentYear = new Date().getFullYear()
    const startYear = 1960
    const yearRange = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i)

    const getMonthName = (monthNumber: number) => {
        return locale === 'ka' ? georgianMonths[monthNumber] : englishMonths[monthNumber]
    }

    const daysInMonth = selectedDate ? getDaysInMonth(selectedDate) : 31

    return (
        <div className="flex h-auto flex-row gap-2">
            <Select
                value={selectedDate ? selectedDate.getFullYear().toString() : ''}
                onValueChange={handleYearChange}
            >
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={t('year')}>
                        {selectedDate ? selectedDate.getFullYear().toString() : t('year')}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {yearRange.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select
                value={
                    selectedDate ? (selectedDate.getMonth() + 1).toString().padStart(2, '0') : ''
                }
                onValueChange={handleMonthChange}
            >
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={t('month')}>
                        {selectedDate ? getMonthName(selectedDate.getMonth()) : t('month')}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {(locale === 'ka' ? georgianMonths : englishMonths).map((month, index) => (
                            <SelectItem
                                key={index + 1}
                                value={(index + 1).toString().padStart(2, '0')}
                            >
                                {month}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select
                value={selectedDate ? selectedDate.getDate().toString().padStart(2, '0') : ''}
                onValueChange={handleDayChange}
            >
                <SelectTrigger className=" w-[100px]">
                    <SelectValue placeholder={t('day')}>
                        {selectedDate
                            ? selectedDate.getDate().toString().padStart(2, '0')
                            : t('day')}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                            <SelectItem key={day} value={day.toString().padStart(2, '0')}>
                                {day}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default BirthDatePicker
