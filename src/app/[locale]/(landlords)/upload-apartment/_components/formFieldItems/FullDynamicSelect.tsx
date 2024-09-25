import { HousingConditionObject, HousingStatusObject } from '@/graphql/typesGraphql'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/shadcnSelect'
import { useTranslation } from 'react-i18next'

type ApartmentStatusProps = {
    field: any
    data?: HousingStatusObject[] | null | HousingConditionObject[]
}

export default function FullDynamicSelect({ field, data }: ApartmentStatusProps) {
    const { t } = useTranslation()

    const handleSelectChange = (value: string) => {
        field.onChange(value)
    }
    return (
        <Select onValueChange={handleSelectChange} defaultValue={field.value}>
            <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="-" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {data?.map((item, index) => (
                        <SelectItem key={index} value={item.id}>
                            {item.translations[0].name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
