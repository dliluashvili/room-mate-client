import React, { useState } from 'react'
import { Language } from '@/graphql/typesGraphql'
import { Button } from '@/src/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { useTranslation } from 'react-i18next'

export default function AddressTextArea({ form }: any) {
    const [selectedLangTitle, setSelectedLangTitle] = useState<Language>(Language.Ka)

    const { t } = useTranslation()

    const getAddressByLangTitle = (lang: Language) => {
        return (
            form.getValues('streets')?.find((street: any) => street.lang === lang) || {
                text: '',
                lang,
            }
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {selectedLangTitle && (
                <FormField
                    control={form.control}
                    name="streets"
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
                                    value={getAddressByLangTitle(selectedLangTitle).text}
                                    onChange={(e) => {
                                        const newStreets = [...field.value]
                                        const index = newStreets.findIndex(
                                            (desc) => desc.lang === selectedLangTitle
                                        )
                                        if (index > -1) {
                                            newStreets[index] = {
                                                ...newStreets[index],
                                                text: e.target.value,
                                            }
                                            field.onChange(newStreets)
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
