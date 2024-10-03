'use client'

import { Button } from '@/src/components/ui/button'

import Link from 'next/link'

import { useTranslation } from 'react-i18next'

export default function CoverSection() {
    const { t } = useTranslation()

    return (
        <>
            <section className="w-full px-6 pb-2 pt-6  sm:px-16 md:px-20  xl:px-24">
                <div className=" h-[250px] rounded-md  bg-mobileCoverBg bg-cover bg-right-bottom bg-no-repeat md:h-[300px] ">
                    <div className="flex  w-4/5 flex-col  rounded-xl  pl-4  pt-[90px] sm:w-1/2 md:w-2/3 md:pt-28 lg:w-2/3 lg:pt-20 xl:w-full xl:pt-28 ">
                        <p className="text-xl font-medium leading-8  text-[#ffffff] md:text-2xl lg:text-3xl xl:text-4xl ">
                            {t('coverHeader')}
                        </p>
                    </div>
                    <div className=" hidden flex-row justify-start gap-x-4 pl-4 pt-6 md:flex xl:pt-12">
                        <Link href="/roommates">
                            <Button className="w-auto   lg:text-base ">{t('findRoommate')}</Button>
                        </Link>
                        <Link href="/apartments">
                            <Button className="w-auto lg:text-base">{t('rentApartment')}</Button>
                        </Link>
                    </div>
                </div>
                <div className="mt-4 flex flex-row justify-between gap-x-4 md:hidden">
                    <Link className="w-full" href="/roommates">
                        <Button className="w-full px-2 md:text-base">{t('findRoommate')}</Button>
                    </Link>
                    <Link className="w-full" href="/apartments">
                        <Button className="w-full px-0 md:text-base">{t('rentApartment')}</Button>
                    </Link>
                </div>
            </section>
        </>
    )
}
