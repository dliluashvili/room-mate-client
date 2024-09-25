'use client'

import { getUserQuery } from '@/graphql/query'
import { withAuth } from '@/src/auth/withAuth'
import {
    Audio,
    Blank,
    Hand,
    House,
    Lamp,
    ProfileContractIcon,
    ProfileRentIcon,
} from '@/src/components/svgs'
import { Button } from '@/src/components/ui/button'
import { FACEBOOK_URL } from '@/src/constants/links'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

function ClientWrapper() {
    const { t } = useTranslation()
    const { data: user, loading: userLoading } = useQuery(getUserQuery)

    return (
        <main className="flex min-h-screen w-full flex-col items-center gap-6 px-6 py-4 md:gap-10 md:pb-20 lg:px-[300px]">
            <div className="flex w-full flex-row gap-6 px-6 md:pb-10">
                <h1 className="text-lg font-medium md:text-3xl">
                    <span className="mr-1">{t('hello')}</span>
                    {user?.me.firstname}
                </h1>
                <Hand className="h-8 w-8" />
            </div>
            <div className="grid grid-cols-1 gap-6   md:grid-cols-2 md:grid-rows-1 ">
                <div className="flex flex-col items-center justify-end rounded-md border bg-[#FFFFFF] p-4  shadow-xl md:p-6">
                    <div className="flex  h-full w-full flex-col items-center  gap-4">
                        <ProfileRentIcon className="h-24 w-40" />
                        <span className="text-center  text-base font-medium">{t('rentOut')}</span>
                        <span className="text-center  text-sm font-medium">
                            {t('rentOutDescribe')}
                        </span>
                        <Link href="/upload-apartment">
                            <Button className="w-auto bg-[#F59E0B] hover:bg-[#F59E0B] focus:bg-[#F59E0B]">
                                {t('uploadApartment')}
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col items-center rounded-md border bg-[#FFFFFF] p-4  shadow-xl md:p-6">
                    <div className="flex h-full w-full flex-col items-center justify-end  gap-4">
                        <ProfileContractIcon className="h-24 w-40" />
                        <span className="text-center  text-base font-medium">
                            {t('downloadContract')}
                        </span>
                        <span className="text-center  text-sm font-medium">
                            {t('contractDescribe')}
                        </span>
                        <a href="/files/Landlord_x_Student_ENG.GEO.docx" download>
                            <Button className="w-auto bg-[#F59E0B] hover:bg-[#F59E0B] focus:bg-[#F59E0B]">
                                {t('downloadContract')}
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
            <div className="h-[1px] w-full bg-[#E3E3E3]"></div>
            <div className="flex w-full flex-col gap-4 md:items-start">
                <div className="flex flex-row gap-4">
                    <Link href="/apartment-list" className="hover:bg-slate-100">
                        <button className="flex h-full items-center justify-center gap-2 rounded-md border border-[#838CAC] p-2 text-[#838CAC] md:w-52">
                            <House className="h-5 w-5" />
                            <span className="text-xs">{t('myListings')}</span>
                        </button>
                    </Link>
                    <Link target="_blank" href="/apartments">
                        <button className="flex h-full items-center justify-center gap-2 rounded-md border border-[#838CAC] p-3 text-[#838CAC] md:w-52">
                            <Blank className="h-5 w-5" />
                            <span className="text-xs">{t('allList')}</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="h-[1px] w-full bg-[#E3E3E3]"></div>
            <div className="flex w-full flex-col gap-8">
                <Link target="_blank" href={FACEBOOK_URL} className="hover:bg-slate-100">
                    <div className="flex w-full flex-row items-center gap-2 rounded-md border border-[#838CAC]  p-3 ">
                        <Lamp className="h-10 w-32" />
                        <div className="flex flex-col gap-3">
                            <h1 className="text-base font-semibold">{t('contactLandlord')}</h1>
                            <span className="text-sm leading-5">{t('supportQuestions')}</span>
                        </div>
                    </div>
                </Link>
                <Link
                    target="_blank"
                    href="https://www.roommate.blog"
                    className="hover:bg-slate-100"
                >
                    <div className="flex flex-row items-center gap-2 rounded-md border border-[#838CAC] p-3">
                        <Audio className="h-10 w-32" />
                        <div className="flex flex-col gap-3">
                            <h1 className="text-base font-semibold">{t('blog')}</h1>
                            <span className="text-sm leading-5">{t('aboutBlog')}</span>
                        </div>
                    </div>
                </Link>
            </div>
        </main>
    )
}

export default withAuth(ClientWrapper)
