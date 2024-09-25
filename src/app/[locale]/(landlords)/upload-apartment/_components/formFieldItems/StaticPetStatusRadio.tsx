import { Label } from '@/src/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group'
import { useTranslation } from 'react-i18next'

export default function StaticPetStatusRadio({ field }: any) {
    const { t } = useTranslation()
    return (
        <RadioGroup
            value={field.value ? field.value : undefined}
            onValueChange={(value) => field.onChange(!value)}
        >
            <div className="mt-2 flex items-center space-x-4">
                <RadioGroupItem value="true" id="yes" />
                <Label
                    htmlFor="yes"
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed  peer-disabled:opacity-70 md:text-sm"
                >
                    {t('yes')}
                </Label>

                <RadioGroupItem value="false" id="no" />
                <Label
                    htmlFor="no"
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed  peer-disabled:opacity-70 md:text-sm"
                >
                    {t('no')}
                </Label>
            </div>
        </RadioGroup>
    )
}
