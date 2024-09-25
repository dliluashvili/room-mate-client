'use client'

import { Resource, createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import initTranslations from '@/src/libs/i18n/i18n'
import { ReactNode } from 'react'

export default function TranslationsProvider({
    children,
    locale,
    namespaces,
    resources,
}: {
    children: ReactNode
    locale: string
    namespaces: string[]
    resources: Resource
}) {
    const i18n = createInstance()

    initTranslations(locale, namespaces, i18n, resources)

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
