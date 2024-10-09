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

    const [selectedYear, setSelectedYear] = useState<string>('')
    const [selectedMonth, setSelectedMonth] = useState<string>('')
    const [selectedDay, setSelectedDay] = useState<string>('')
    const [daysInMonth, setDaysInMonth] = useState<number>(31)

    useEffect(() => {
        if (field.value) {
            const date = parse(field.value, 'yyyy-MM-dd', new Date())

            if (isValid(date)) {
                const year = format(date, 'yyyy')
                const month = format(date, 'MM')
                const day = format(date, 'dd')

                setSelectedYear(year)
                setSelectedMonth(month)
                setSelectedDay(day)

                setDaysInMonth(getDaysInMonth(date))
            } else {
                console.log('Invalid date:', field.value)
            }
        } else {
            console.log('No field value')
        }
    }, [field.value, selectedYear, selectedMonth, selectedDay])

    const handleYearChange = (value: string) => {
        setSelectedYear(value)
        updateFieldValue(value, selectedMonth, selectedDay)
    }

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value)
        updateFieldValue(selectedYear, value, selectedDay)
    }

    const handleDayChange = (value: string) => {
        setSelectedDay(value)
        updateFieldValue(selectedYear, selectedMonth, value)
    }

    const updateFieldValue = (year: string, month: string, day: string) => {
        if (year && month && day) {
            const newDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            field.onChange(newDate)
        }
    }

    const currentYear = new Date().getFullYear()
    const startYear = 1960
    const yearRange = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i)

    const getMonthName = (monthNumber: string) => {
        const index = parseInt(monthNumber, 10) - 1
        return locale === 'ka' ? georgianMonths[index] : englishMonths[index]
    }

    return (
        <div className="flex h-[20px] flex-row gap-2">
            <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={t('year')}>{selectedYear || t('year')}</SelectValue>
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

            <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={t('month')}>
                        {selectedMonth ? getMonthName(selectedMonth) : t('month')}
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

            <Select value={selectedDay} onValueChange={handleDayChange}>
                <SelectTrigger className="z-50 w-[100px]">
                    <SelectValue className="z-50" placeholder={t('day')}>
                        {selectedDay || t('day')}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="z-50">
                    <SelectGroup className="z-50">
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                            <SelectItem
                                className="z-50"
                                key={day}
                                value={day.toString().padStart(2, '0')}
                            >
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
