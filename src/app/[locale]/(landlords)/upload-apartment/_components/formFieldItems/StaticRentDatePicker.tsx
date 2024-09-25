import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { getDaysInMonth } from 'date-fns'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/shadcnSelect'

import { format } from 'date-fns'

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

interface RentDatePickerProps {
    field: any
}

function StaticRentDatePicker({ field }: RentDatePickerProps) {
    const { t } = useTranslation()
    const [date, setDate] = useState(field.value || '')
    const params = useParams()
    const locale = params.locale

    const [selectedYear, setSelectedYear] = useState('')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [selectedDay, setSelectedDay] = useState('')
    const [daysInMonth, setDaysInMonth] = useState(31)

    useEffect(() => {
        if (field.value !== date) {
            setDate(field.value || '')
        }
    }, [field.value])

    useEffect(() => {
        if (selectedYear && selectedMonth) {
            const monthIndex = parseInt(selectedMonth, 10) - 1
            setDaysInMonth(getDaysInMonth(new Date(parseInt(selectedYear), monthIndex)))
        }
    }, [selectedYear, selectedMonth])

    useEffect(() => {
        if (selectedYear && selectedMonth && selectedDay) {
            const newDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}`
            setDate(newDate)
            const formattedDate = newDate ? format(newDate, 'yyyy-MM-dd') : null
            field.onChange(formattedDate)
            field.onChange(newDate)
        }
    }, [selectedYear, selectedMonth, selectedDay])

    const handleYearChange = (value: string) => {
        setSelectedYear(value)
        setSelectedDay('')
        field.onChange('')
    }

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value)
        setSelectedDay('')
        field.onChange('')
    }

    const handleDayChange = (value: string) => {
        setSelectedDay(value)
    }

    const currentYear = new Date().getFullYear()
    const endYear = currentYear + 10

    const yearRange = Array.from({ length: endYear - currentYear + 1 }, (_, i) => currentYear + i)

    const currentDay = new Date().getDate()

    return (
        <div className="flex flex-row gap-2">
            <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={t('year')} />
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
                    <SelectValue placeholder={t('month')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {(locale === 'ka' ? georgianMonths : englishMonths).map((month, index) => (
                            <SelectItem key={index + 1} value={(index + 1).toString()}>
                                {month}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select value={selectedDay} onValueChange={handleDayChange}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={t('day')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                            <SelectItem key={day} value={day.toString()}>
                                {day}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default StaticRentDatePicker
