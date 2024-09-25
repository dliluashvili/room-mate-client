'use client'

import { BankIcon, RateStar, RateStars } from '@/src/components/svgs'
import { useTranslation } from 'react-i18next'

export default function FeatureSection() {
    const { t } = useTranslation()
    return (
        <>
            <section className="mt-12 flex w-full justify-between  px-6 sm:px-16 md:px-20 lg:mt-24 lg:grid lg:grid-flow-col lg:grid-cols-4 lg:gap-x-12 xl:px-24">
                <div className="flex w-16 flex-col items-center lg:w-full lg:items-start">
                    <BankIcon className="h-8 w-8" />
                    <div className="mt-4 flex flex-col">
                        <div className=" flex h-12  w-full items-start md:h-20 xl:h-12">
                            <h1 className="break-words text-center text-xs text-[#838cac] lg:text-left lg:text-lg lg:font-semibold lg:text-[#484848]">
                                {t('Register')}
                            </h1>
                        </div>
                        <p className="hidden text-base font-normal lg:mt-2 lg:block xl:mt-3">
                            {t('createAccount')}
                        </p>
                    </div>
                </div>
                <div className="flex w-16 flex-col items-center lg:w-full lg:items-start">
                    <BankIcon className="h-8 w-8" />
                    <div className="mt-4 flex flex-col">
                        <div className=" flex  h-12 w-full items-start md:h-20 xl:h-12">
                            <h1 className="break-words text-center text-xs text-[#838cac] lg:text-left lg:text-lg lg:font-semibold lg:text-[#484848]">
                                {t('uploadProperty')}
                            </h1>
                        </div>
                        <p className="hidden text-base lg:mt-2 lg:block xl:mt-3">
                            {t('uploadMap')}
                        </p>
                    </div>
                </div>
                <div className="flex w-16 flex-col items-center lg:w-full lg:items-start">
                    <BankIcon className="h-8 w-8" />
                    <div className="mt-4 flex flex-col">
                        <div className=" flex h-12  w-full items-start md:h-20 xl:h-12">
                            <h1 className="break-words text-center text-xs text-[#838cac] lg:text-left lg:text-lg lg:font-semibold lg:text-[#484848]">
                                {t('waitForTenants')}
                            </h1>
                        </div>
                        <p className="hidden text-base lg:mt-2 lg:block xl:mt-3">
                            {t('tenantsContact')}
                        </p>
                    </div>
                </div>
                <div className="flex w-16 flex-col items-center lg:w-full lg:items-start">
                    <RateStar className=" block h-8 w-8 lg:hidden" />

                    <RateStars className=" hidden h-8 w-[120px] lg:block" />

                    <div className="mt-4 flex flex-col">
                        <div className=" flex  h-12 w-full items-start md:h-20 xl:h-12">
                            <span className="break-words text-center text-xs text-[#838cac] lg:text-left lg:text-lg lg:font-semibold lg:text-[#484848]">
                                {t('support')}
                            </span>
                        </div>
                        <p className="hidden text-base lg:mt-2 lg:block xl:mt-3">
                            {t('suppoertDescribe')}
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}
