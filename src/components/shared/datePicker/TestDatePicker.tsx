import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { Input } from '../../ui/input'

interface ReactDatepickerProps {
    field?: {
        onChange: (date: string | null) => void
    }
}

function ReactDatepicker({ field }: ReactDatepickerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const handleDateChange = (newDate: Date | null) => {
        setSelectedDate(newDate)
        if (field) {
            const formattedDate = newDate ? format(newDate, 'yyyy-MM-dd') : null
            field.onChange(formattedDate)
        }
    }

    console.log(field)

    const renderYearContent = (year: number) => {
        const currentYear = new Date().getFullYear()
        return (
            <span className="react-datepicker__year-text">
                {year}
                {year < currentYear && <span className="year-label past">Past</span>}
                {year > currentYear && <span className="year-label future">Future</span>}
            </span>
        )
    }
    return (
        <div className="row w-full">
            <form className="row w-full">
                <div className="row mb-0 w-full">
                    <DatePicker
                        className="custom-datepicker w-full"
                        customInput={<Input className="w-full" />}
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd-MM-yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        calendarClassName="custom-calendar"
                        renderYearContent={renderYearContent}
                        yearDropdownItemNumber={45}
                        // dayClassName={(date) =>
                        //     date.getDay() === 0 || date.getDay() === 6 ? 'weekend-day' : undefined
                        // }
                    />
                </div>
            </form>
        </div>
    )
}

export default ReactDatepicker
