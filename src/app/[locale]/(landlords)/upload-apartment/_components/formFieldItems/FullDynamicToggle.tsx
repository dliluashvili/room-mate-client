import { PropertyTypeObject } from '@/graphql/typesGraphql'
import { ToggleGroup, ToggleGroupItem } from '@/src/components/ui/toggle-group'

interface PropertyTypeProps {
    field: any
    data?: PropertyTypeObject[] | null
}

export default function FullDynamicToggle({ field, data }: PropertyTypeProps) {
    return (
        <ToggleGroup
            className="justify-start"
            type="single"
            value={field.value}
            onValueChange={(value) => {
                if (value) {
                    field.onChange(value)
                }
            }}
        >
            {data?.map((item, index) => (
                <ToggleGroupItem key={index} value={item.id}>
                    {item.translations[0]?.name}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}
