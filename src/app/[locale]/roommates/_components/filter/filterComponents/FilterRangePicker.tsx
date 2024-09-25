'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/src/utils/cn'
import { useTranslation } from 'react-i18next'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover'
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/src/components/ui/drawer'
import { Calendar } from '@/src/components/ui/calendar'
import { useEffect, useState } from 'react'

type RangeDataProps = {
    questionId: string
    dataRange: string[] | string
    questionName: string
}

type FilterRangePickerProps = {
    className: string
    questionId: string
    ranges: RangeDataProps[]
    rangeChangeHandler: (questionId: string, questionName: string, dataRange: string[]) => void
    isOpen: boolean
    questionName: string
}

export const FilterRangePicker = ({
    className,
    questionId,
    ranges,
    isOpen,
    questionName,
    rangeChangeHandler,
}: FilterRangePickerProps) => {
    const { t } = useTranslation()
    const [formattedDateArray, setFormattedDateArray] = useState<string[] | undefined>([])
    const matchingQuestion = ranges.find((item) => item.questionId === questionId)
    const [date, setDate] = useState<DateRange | undefined>()

    const formatDate = (date: Date | undefined): string | undefined => {
        return date ? format(date, 'yyyy-MM-dd') : undefined
    }
    const defaultMonth = date?.from ? new Date(date.from) : new Date()
    const updateRangeHandler = () => {
        rangeChangeHandler(questionId, questionName, formattedDateArray || [])
    }
    const handleDateChange = (newDate: DateRange | undefined) => {
        setDate(newDate)
    }

    useEffect(() => {
        if (date?.from && date?.to) {
            const formattedData = [formatDate(date.from), formatDate(date.to)]
            setFormattedDateArray(formattedData.filter(Boolean) as string[])
        } else {
            setFormattedDateArray(undefined)
        }
    }, [date])

    useEffect(() => {
        if (matchingQuestion && matchingQuestion?.dataRange?.length > 0)
            setDate({
                from: new Date(matchingQuestion.dataRange[0]),
                to: new Date(matchingQuestion.dataRange[1]),
            })
    }, [isOpen, matchingQuestion])

    const TriggerComponent = () => {
        return (
            <>
                <div
                    className={cn(
                        'inline-flex h-[36px] w-full cursor-pointer items-center rounded-lg border border-[#828bab] px-3 py-2 text-left font-normal hover:bg-white focus:outline-[#3dae8c] focus-visible:outline-none',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <div className="flex h-auto flex-row items-center justify-center text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {formattedDateArray && date?.from && date?.to ? (
                            <>
                                {format(date?.from, 'LLL dd, yyyy')} -
                                {format(date?.to, 'LLL dd, yyyy')}
                            </>
                        ) : (
                            <span className="text-muted-foreground">{t('chooseDate')}</span>
                        )}
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className={cn('hidden gap-2 md:grid', className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <div>
                            <TriggerComponent />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        onBlur={updateRangeHandler}
                    >
                        <Calendar
                            defaultMonth={defaultMonth}
                            initialFocus
                            numberOfMonths={2}
                            mode="range"
                            pagedNavigation
                            selected={date}
                            onSelect={handleDateChange}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Drawer>
                <DrawerTrigger className="mt-2 w-full md:hidden">
                    <TriggerComponent />
                </DrawerTrigger>
                <DrawerContent>
                    <Calendar
                        defaultMonth={defaultMonth}
                        initialFocus
                        numberOfMonths={2}
                        mode="range"
                        pagedNavigation
                        selected={date}
                        onSelect={handleDateChange}
                    />
                    <DrawerClose className="flex w-full justify-center">
                        <div
                            className="h-auto w-3/4 items-center justify-center rounded-md bg-mainGreen px-10 py-2 text-sm text-white focus:bg-pressedGreen"
                            onClick={updateRangeHandler}
                        >
                            {t('submit')}
                        </div>
                    </DrawerClose>
                </DrawerContent>
            </Drawer>
        </>
    )
}
