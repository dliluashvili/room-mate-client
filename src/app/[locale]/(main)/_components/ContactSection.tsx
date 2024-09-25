'use client'

import { EmailIcon, PhoneIcon, WhatsappIcon } from '@/src/components/svgs'
import { WHATSAPP_URL } from '@/src/constants/links'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function ContactSection() {
    const { t } = useTranslation()

    return (
        <section className="lg:mt- mt-10 flex w-full flex-col items-center bg-[#F2F5FF] px-6 py-5 sm:px-16 md:flex-row md:px-20 md:py-10 xl:px-24">
            <div className="w-full lg:w-[30%] ">
                <h1 className="font-bgCaps text-xl">{t('contactUs')}</h1>
                <p className="mt-2 text-xs  lg:text-base">{t('contactUsText')}</p>
            </div>
            <div className="mt-6 grid w-full grid-cols-2 justify-end gap-x-4 gap-y-4 lg:mt-0 lg:flex lg:gap-x-6">
                <Link target="_blank" href="tel:+995599976385">
                    <div className="flex cursor-pointer flex-row items-center justify-center rounded-lg bg-[#fff5f0] px-7 py-3 md:px-6 lg:flex-col lg:px-8 lg:py-4">
                        <PhoneIcon className="h-6 w-6 lg:h-7 lg:w-7" />
                        <span className="ml-3 text-xs text-[#391515] lg:ml-0 lg:mt-3 lg:text-[14px]">
                            599 123 456
                        </span>
                    </div>
                </Link>
                <Link target="_blank" href={WHATSAPP_URL}>
                    <div className="flex cursor-pointer flex-row items-center justify-center rounded-lg bg-[#e6f9f0]  px-8 py-3 lg:flex-col lg:px-10 lg:py-4">
                        <WhatsappIcon className="h-6 w-6 lg:h-7 lg:w-7" />
                        <span className="ml-3 rounded-lg text-xs  text-[#19a463] lg:ml-0 lg:mt-3 lg:text-[14px]">
                            whatsapp
                        </span>
                    </div>
                </Link>
                <Link target="_blank" href="mailto:info@roommate.ge">
                    <div className="flex cursor-pointer flex-row items-center justify-center rounded-lg bg-[#e4e0fa] px-3 py-3 lg:flex-col lg:px-4 lg:py-4">
                        <EmailIcon className="h-6 w-6 lg:h-7 lg:w-7" />
                        <span className="ml-2 text-xs text-[#633fca] lg:ml-0 lg:mt-3 lg:text-[14px]">
                            info@roommate.ge
                        </span>
                    </div>
                </Link>
            </div>
        </section>
    )
}
