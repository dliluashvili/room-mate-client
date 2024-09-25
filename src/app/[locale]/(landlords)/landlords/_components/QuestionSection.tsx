'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/src/components/ui/accordion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type AccordionItems = {
    value: string
    question: string
    answer: string
}

export default function QuestionSection() {
    const { t } = useTranslation()
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
    const items: AccordionItems[] = [
        {
            value: 'item-1',
            question: t('question1'),
            answer: t('answer1'),
        },
        {
            value: 'item-2',
            question: t('question2'),
            answer: t('answer2'),
        },
        {
            value: 'item-3',
            question: t('question3'),
            answer: t('answer3'),
        },
    ]

    const handleClick = (value: string) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [value]: !prevOpenItems[value],
        }))
    }
    const bgColor = (value: string) => (openItems[value] ? '#DFE6FC' : '#f2f5ff')

    return (
        <section className="bg-[#f2f5ff] px-6 pb-12 pt-6 sm:px-16 md:px-20 xl:px-24 ">
            <h1 className="font-bgCaps text-xl">{t('questionsHead')}</h1>
            {items.map((item) => (
                <Accordion
                    key={item.value}
                    type="single"
                    collapsible
                    className="mt-6 w-full rounded-lg"
                >
                    <AccordionItem
                        value={item.value}
                        style={{ backgroundColor: bgColor(item.value) }}
                        className="rounded-lg "
                    >
                        <div
                            onClick={() => handleClick(item.value)}
                            className="flex w-full flex-row  items-center rounded-lg"
                        >
                            <div className="w-full ">
                                <AccordionTrigger className="items-start justify-start text-left text-[14px] font-semibold">
                                    {item.question}
                                </AccordionTrigger>
                            </div>
                        </div>
                        <AccordionContent className="p-4 pt-0 text-left text-xs leading-5 md:pl-12">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </section>
    )
}
