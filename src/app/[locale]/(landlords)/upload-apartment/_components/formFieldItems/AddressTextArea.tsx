import { Language } from '@/graphql/typesGraphql'
import { Button } from '@/src/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AddressTextArea({ form }: any) {
    const { t } = useTranslation()
    const [selectedLangTitle, setSelectedLangTitle] = useState<Language>(Language.Ka)
    const getDescriptionByLangTitle = (lang: Language) => {
        return (
            form.getValues('street')?.find((desc: any) => desc.lang === lang) || { text: '', lang }
        )
    }
    return (
        <div className="flex flex-col gap-4">
            {selectedLangTitle && (
                <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>{t('address')}</FormLabel>

                            <div className="mb-4 flex gap-2">
                                <Button
                                    type="button"
                                    className={`h-auto text-xs hover:text-white ${selectedLangTitle === Language.Ka ? 'bg-mainGreen text-white' : 'bg-gray-200 text-black'}`}
                                    onClick={() => setSelectedLangTitle(Language.Ka)}
                                >
                                    {t('Georgian')}
                                </Button>
                                <Button
                                    type="button"
                                    className={`h-auto text-xs hover:text-white ${selectedLangTitle === Language.En ? 'bg-mainGreen text-white' : 'bg-gray-200 text-black'}`}
                                    onClick={() => setSelectedLangTitle(Language.En)}
                                >
                                    {t('English')}
                                </Button>
                            </div>
                            <FormControl>
                                <Input
                                    placeholder={t('addressDetails')}
                                    className="h-10 text-xs md:text-sm"
                                    value={getDescriptionByLangTitle(selectedLangTitle).text}
                                    onChange={(e) => {
                                        const newDescriptions = [...field.value]
                                        const index = newDescriptions.findIndex(
                                            (desc) => desc.lang === selectedLangTitle
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
    )
}
