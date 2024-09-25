import { ToggleGroup, ToggleGroupItem } from '@/src/components/ui/toggle-group'

export default function StaticNumericToggle({ field }: any) {
    return (
        <ToggleGroup
            className="justify-start"
            type="single"
            value={field.value?.toString()}
            onValueChange={(value) => {
                if (value) {
                    field.onChange(parseFloat(value))
                }
            }}
        >
            {Array.from({ length: 10 }, (_, index) => (
                <ToggleGroupItem className="w-auto" key={index + 1} value={(index + 1).toString()}>
                    {index + 1}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}
