'use client'

import { DayPicker } from 'react-day-picker'
import { cn } from '@/src/utils/cn'
import { buttonVariants } from '@/src/components/ui/button'
import { ka } from 'date-fns/locale/ka'
import { useParams } from 'next/navigation'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    const params = useParams()
    const lang = params.locale === 'en' ? undefined : ka
    return (
        <DayPicker
            fromYear={2024}
            toYear={2030}
            locale={lang}
            showOutsideDays={showOutsideDays}
            className={cn(' p-3', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-2 gap-8 items-center md:items-start justify-center sm:space-y-0',
                dropdown_month: 'flex flex-row justify-start items-start  mr-2',
                month: 'space-y-2 bg-white',
                caption: 'flex justify-center flex-row pt-1 relative items-center justify-center',
                caption_dropdowns:
                    'w-full flex flex-row  justify-center py-1 md:justify-start items-center px-1 gap-2',
                dropdown: ' border-none focus:border-none ring-0 outline-none cursor-pointer gap-0',
                vhidden: 'hidden',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 rounded-full [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9 p-0 font-normal  aria-selected:opacity-100 rounded-full  '
                ),
                day_range_end: 'day-range-end rounded-full',
                day_selected:
                    'text-primary-foreground rounded-full bg-mainGreen hover:bg-hoverGreen hover:text-primary-foreground focus:bg-mainGreen focus:text-primary-foreground',
                day_today: 'text-accent-foreground',
                day_outside:
                    'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle: 'aria-selected:bg-slate-300 aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
                ...classNames,
            }}
            {...props}
        />
    )
}
Calendar.displayName = 'Calendar'

export { Calendar }
