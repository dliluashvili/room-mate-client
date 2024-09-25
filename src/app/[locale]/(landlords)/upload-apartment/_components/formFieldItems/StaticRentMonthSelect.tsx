import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/shadcnSelect'
import { useTranslation } from 'react-i18next'

export default function StaticRentMonthSelect({ field }: any) {
    const { t } = useTranslation()

    const handleSelectChange = (value: string) => {
        field.onChange(parseFloat(value))
    }
    return (
        <Select onValueChange={handleSelectChange} defaultValue={field.value}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('selectPeriod')} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="1">{t('oneMonth')}</SelectItem>
                    <SelectItem value="6">{t('sixMonth')}</SelectItem>
                    <SelectItem value="12">{t('twelweMonth')}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
