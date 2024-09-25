import {
    HousingHeatingTypeObject,
    HousingLivingSafetyObject,
    PropertyAmenityObject,
} from '@/graphql/typesGraphql'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Label } from '@/src/components/ui/label'

type FullDynamicCheckboxProps = {
    data?: PropertyAmenityObject[] | HousingHeatingTypeObject[] | HousingLivingSafetyObject[] | null
    field: any
}

export default function FullDynamicCheckbox({ data, field }: FullDynamicCheckboxProps) {
    return (
        <>
            {data?.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={item.id}
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                            return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                      field.value?.filter((value: string) => value !== item.id)
                                  )
                        }}
                        field={undefined}
                    />
                    <Label className="text-xs md:text-sm">{item.translations[0].name}</Label>
                </div>
            ))}
        </>
    )
}
