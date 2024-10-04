import { PropertyDepositObject } from '@/graphql/typesGraphql'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/shadcnSelect'

type ApartmentStatusProps = {
    field: any
    data?: PropertyDepositObject[] | null
    form: any
}

export default function FullDynamicSelectDeposit({ field, data, form }: ApartmentStatusProps) {
    const handleSelectChange = (value: string) => {
        if (value !== '') field.onChange(value)
    }
    const depositStatus = form.getValues('withDeposit')

    return (
        <Select disabled={!depositStatus} onValueChange={handleSelectChange} value={field.value}>
            <SelectTrigger className="w-full text-start md:w-52">
                <SelectValue placeholder="-" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {data?.map((item, index) => (
                        <SelectItem className="text-start" key={index} value={item.id}>
                            {item.amount
                                ? item.amount
                                : item.translations && item.translations[0]
                                  ? item.translations[0].description
                                  : 'No description available'}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
