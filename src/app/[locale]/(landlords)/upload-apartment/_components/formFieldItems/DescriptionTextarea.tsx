import { Language } from '@/graphql/typesGraphql'
import { Button } from '@/src/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function DescriptionTextarea({ form }: any) {
    const { t } = useTranslation()
    const [selectedLangDescription, setSelectedLangDescription] = useState<Language>(Language.Ka)
    const getDescriptionByLangDescription = (lang: Language) => {
        return (
            form.getValues('descriptions')?.find((desc: any) => desc.lang === lang) || {
                text: '',
                lang,
            }
        )
    }
    return (
        <>
            <div className="flex flex-col gap-4">
                {selectedLangDescription && (
                    <FormField
                        control={form.control}
                        name="descriptions"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t('description')}</FormLabel>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        className={` h-auto text-xs  hover:text-white  ${selectedLangDescription === Language.Ka ? 'bg-mainGreen text-white' : 'bg-gray-200 text-black'}`}
                                        onClick={() => setSelectedLangDescription(Language.Ka)}
                                    >
                                        {t('Georgian')}
                                    </Button>
                                    <Button
                                        type="button"
                                        className={`  h-auto text-xs hover:text-white ${selectedLangDescription === Language.En ? 'bg-mainGreen text-white' : 'bg-gray-200 text-black'}`}
                                        onClick={() => setSelectedLangDescription(Language.En)}
                                    >
                                        {t('English')}
                                    </Button>
                                </div>

                                <FormControl>
                                    <textarea
                                        spellCheck="false"
                                        className="w-full rounded-md border border-[#828bab] px-3 py-2 text-sm focus:border-hoverGreen focus:outline-none"
                                        rows={10}
                                        value={
                                            getDescriptionByLangDescription(selectedLangDescription)
                                                .text
                                        }
                                        onChange={(e) => {
                                            const newDescriptions = [...field.value]
                                            const index = newDescriptions.findIndex(
                                                (desc) => desc.lang === selectedLangDescription
                                            )
                                            if (index > -1) {
                                                newDescriptions[index] = {
                                                    ...newDescriptions[index],
                                                    text: e.target.value,
                                                }
                                                field.onChange(newDescriptions)
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>
        </>
    )
}
