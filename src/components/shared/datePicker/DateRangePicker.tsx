'use client'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/src/utils/cn'
import { Button } from '@/src/components/ui/button'
import { Calendar } from '@/src/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover'
import { useTranslation } from 'react-i18next'
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/src/components/ui/drawer'
import { ControllerRenderProps } from 'react-hook-form'
import { useState } from 'react'

interface RangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    field?: ControllerRenderProps<Record<string, string>, string>
    id?: string
    updateUseForm?: (data: Record<string, string[] | undefined>) => Promise<void>
}

export const RangePicker = ({ className, updateUseForm, field, id }: RangePickerProps) => {
    const { t } = useTranslation()
    const initialDate = () => {
        if (field?.value && Array.isArray(field.value) && field.value.length === 2) {
            const from = new Date(field.value[0])
            const to = new Date(field.value[1])
            if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
                return { from, to }
            }
        }
        return undefined
    }

    const [date, setDate] = useState<DateRange | undefined>(initialDate)
    const defaultMonth = date?.from ? new Date(date.from) : new Date()
    const handleDateChange = (newDate: DateRange | undefined) => {
        setDate(newDate)

        if (newDate?.from && newDate?.to) {
            const formattedFrom = format(newDate.from, 'yyyy-MM-dd')
            const formattedTo = format(newDate.to, 'yyyy-MM-dd')

            if (field) {
                field.onChange([formattedFrom, formattedTo])
            }

            if (updateUseForm && id) {
                updateUseForm({
                    [id]: [formattedFrom, formattedTo],
                })
            }
        } else {
            if (field) {
                field.onChange([])
            }

            if (updateUseForm && id) {
                updateUseForm({ [id]: undefined })
            }
        }
    }

    const renderDateContent = () => (
        <div className="flex h-auto flex-row items-center">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            {date?.from ? (
                date.to ? (
                    <>
                        {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                    </>
                ) : (
                    format(date.from, 'LLL dd, y')
                )
            ) : (
                <span className="text-placeholderColor">{t('chooseDate')}</span>
            )}
        </div>
    )

    return (
        <>
            <div className={cn('hidden gap-2 pb-20 md:grid', className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            id="date"
                            variant={'outline'}
                            className={cn(
                                'flex h-auto w-full justify-start rounded-lg border border-[#828bab] px-3 text-left font-normal hover:bg-white md:w-full'
                            )}
                        >
                            {renderDateContent()}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
                    <Button
                        type="button"
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'flex h-[36px] w-full justify-start rounded-lg border border-[#828bab] px-3 py-2 text-left font-normal outline-none hover:bg-white'
                        )}
                    >
                        {renderDateContent()}
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-12 py-3 h-full">
                    <Calendar
                        defaultMonth={defaultMonth}
                        className="flex flex-row justify-center"
                        initialFocus
                        numberOfMonths={2}
                        mode="range"
                        pagedNavigation
                        selected={date}
                        onSelect={handleDateChange}
                    />
                    <DrawerClose>
                        <Button variant="default" type="button" className="w-4/5">
                            {t('save')}
                        </Button>
                    </DrawerClose>
                </DrawerContent>
            </Drawer>
        </>
    )
}
