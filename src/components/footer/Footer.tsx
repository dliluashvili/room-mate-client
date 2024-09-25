'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { SocialIcons } from '../shared/socialIcons/SocialIcons'
import { useParams, usePathname } from 'next/navigation'
import { EmailIcon, Logo, PhoneIcon } from '../svgs'
import {
    CONFIDENTIAL_EN_URL,
    CONFIDENTIAL_KA_URL,
    TERMS_EN_URL,
    TERMS_KA_URL,
} from '@/src/constants/links'

export default function Footer() {
    const { t } = useTranslation()
    const params = useParams()
    const pathname = usePathname()
    const localePattern = /^\/(en|ka)(\/|$)/
    const pathnameWithoutLocale = pathname.replace(localePattern, '/')
    const isLandlordsPath =
        pathname.includes('/landlords') ||
        pathname.includes('/upload-apartment') ||
        pathname.includes('/apartment-list') ||
        pathname.includes('/landlord-profile')

    return (
        <div className="flex h-full w-full flex-col pt-12">
            <div className="flex flex-col px-6 sm:px-16 md:flex-row md:items-start md:justify-between md:px-20 xl:px-24">
                <Link href={`${isLandlordsPath ? '/landlords' : '/'} `} className="w-auto">
                    <Logo
                        className={` ${isLandlordsPath ? 'fill-mainOrange' : 'fill-mainGreen'} h-6  w-[120px] cursor-pointer md:h-9 md:w-[140px] lg:block xl:h-10 xl:w-[200px]`}
                    />
                </Link>

                <div className="mt-8 flex flex-col  gap-y-4 md:mt-0">
                    <Link href="/">
                        <span
                            className="pointer  text-xs hover:underline "
                            style={{ fontWeight: pathnameWithoutLocale === '/' ? 'bold' : '' }}
                        >
                            {t('main')}
                        </span>
                    </Link>
                    <div className="grid gap-y-4 lg:grid-cols-2 lg:gap-x-20">
                        <Link href="/#">
                            <span
                                className="pointer text-xs hover:underline"
                                style={{
                                    fontWeight: pathnameWithoutLocale === '/#' ? 'bold' : '',
                                }}
                            >
                                {t('findRoommate')}
                            </span>
                        </Link>
                        <Link href="/#">
                            <span
                                className="pointer text-xs hover:underline"
                                style={{
                                    fontWeight: pathnameWithoutLocale === '/login' ? 'bold' : '',
                                }}
                            >
                                {t('rentApartment')}
                            </span>
                        </Link>
                        <span className="pointer text-xs hover:underline">
                            {t('becomePartner')}
                        </span>
                        <Link target="_blank" href="https://roommate.blog/">
                            <span className="pointer text-xs hover:underline"> {t('blog')}</span>
                        </Link>
                        <span className="pointer text-xs hover:underline">{t('howItWorks')}</span>
                    </div>
                </div>
                <div className="mt-8 flex flex-col md:mt-0 ">
                    <h1 className="text-xs font-semibold">{t('contact')}</h1>
                    <div className="mt-4 grid  grid-cols-2 gap-4 md:grid-cols-1 ">
                        <Link href="tel:+995599976385">
                            <div className="pointer flex  flex-row items-center rounded-lg bg-[#F2F5FF] px-2 py-3">
                                <PhoneIcon className="h-4 w-4" />
                                <span className="ml-2 text-xs">599 976 385</span>
                            </div>
                        </Link>
                        <Link href="mailto:info@roommate.ge">
                            <div className="pointer flex  flex-row items-center rounded-lg bg-[#F2F5FF] px-2 py-3">
                                <EmailIcon className="h-4 w-4" />
                                <span className="ml-2 text-xs">info@roommate.ge</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-6 hidden h-[1px]  w-full bg-[#7D7D7D] lg:block  "></div>
            <div className="flex flex-col px-6 sm:px-16 md:px-20 md:py-4 lg:flex-row lg:items-center lg:justify-between xl:px-24">
                <div className=" hidden flex-row gap-x-4 lg:flex">
                    <Link
                        target="_blank"
                        href={params.locale === 'ka' ? TERMS_KA_URL : TERMS_EN_URL}
                    >
                        <span className="pointer text-xs  hover:underline">{t('terms')}</span>
                    </Link>
                    <div className="h-3 w-[1px] bg-[#7D7D7D]"></div>
                    <Link
                        target="_blank"
                        href={params.locale === 'ka' ? CONFIDENTIAL_KA_URL : CONFIDENTIAL_EN_URL}
                    >
                        <span className="pointer text-xs  hover:underline">
                            {t('confidencial')}
                        </span>
                    </Link>
                </div>
                <div className="mt-8 flex flex-col md:mt-0 lg:order-2 ">
                    <div className="mt-4 lg:mt-0">
                        <SocialIcons />
                    </div>
                </div>
                <div className="mt-8 h-[1px] w-full bg-[#7D7D7D] lg:mt-0 lg:hidden "></div>
            </div>
            <div className="mt-4 flex flex-row items-center  justify-around bg-[#F2F5FF] px-6 py-4 sm:px-16 md:px-20 lg:justify-center xl:px-24 ">
                <p className=" text-[8px]">Copyrighyt 2024</p>
                <div className="h-3 w-[1px] bg-[#7D7D7D] lg:hidden"></div>
                <p className=" pointer text-[8px] lg:hidden">{t('terms')}</p>
                <div className="h-3 w-[1px] bg-[#7D7D7D] lg:hidden"></div>
                <p className=" pointer text-[8px] lg:hidden">{t('confidencial')}</p>
            </div>
        </div>
    )
}
