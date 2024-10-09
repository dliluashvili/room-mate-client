'use client'

import Image from 'next/image'
import Avatar from '@images/FemaleAvatar.jpg'
import { useTranslation } from 'react-i18next'
import {
    ArrowRight,
    Bell2,
    Logout,
    Note,
    Setting,
    ShieldSlash,
    UserIcon2,
} from '@/src/components/svgs'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { getUserQuery } from '@/graphql/query'
import { signOutHandler } from '@/src/auth/signOut'
import Link from 'next/link'

export default function ProfileNavBar() {
    const { t } = useTranslation()
    const router = useRouter()
    const pathname = usePathname()
    const { data: user, loading: userLoading } = useQuery(getUserQuery)

    const sectionClickHandler = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams()
            params.set(name, value)
            const query = params.toString()
            router.push(`${pathname}?${query}`)
        },
        [pathname, router]
    )
    return (
        <section className="h-full w-full md:w-[300px]">
            <div className="flex h-full w-full flex-col items-center pb-6 md:flex-row">
                <h1 className="md:hidden">{t('profile')}</h1>
                <div className="relative mt-4 h-24 w-24">
                    <Image
                        fill
                        src={user?.me.profileImage ? user?.me.profileImage : Avatar}
                        className=" h-full w-full rounded-full object-cover"
                        alt="Image"
                    />
                </div>
                <div className="flex h-full w-full  flex-col items-center md:ml-6 md:items-start">
                    <span className="mt-4">
                        {user?.me.firstname} {user?.me.lastname}
                    </span>
                    <span className="mt-2">{user?.me.phone}</span>
                </div>
            </div>
            <div className="mb-4 hidden h-[1px] w-full bg-[#E5E5E5] md:block"></div>
            <div className="flex h-full w-full flex-col items-center gap-4 md:gap-8">
                {/* <button className="flex w-full flex-row items-center justify-between rounded-lg bg-[#FFFFFF] p-4  shadow-md md:bg-[#F5F5F5] md:p-0 md:shadow-none">
                    <div className="flex flex-row items-center">
                        <UserIcon2 className="h-6 w-6" />
                        <span className="ml-3">{t('myPage')}</span>
                    </div>
                    <ArrowRight className="h-6 w-6 md:hidden" />
                </button> */}
                <button className="flex w-full flex-row items-center justify-between rounded-lg bg-[#FFFFFF] p-4  shadow-md md:bg-[#F5F5F5] md:p-0 md:shadow-none">
                    <Link href="/conversation">
                        <div className="flex flex-row items-center">
                            <Bell2 className=" h-6 w-6" />
                            <span className="ml-3">{t('notifications')}</span>
                        </div>
                        <ArrowRight className="h-6 w-6 md:hidden" />
                    </Link>
                </button>

                <button
                    onClick={() => sectionClickHandler('verification', 'true')}
                    className="flex w-full flex-row items-center justify-between rounded-lg bg-[#FFFFFF] p-4  shadow-md md:bg-[#F5F5F5] md:p-0 md:shadow-none"
                >
                    <div className="flex flex-row items-center">
                        <Note className=" h-6 w-6" />
                        <span className="ml-3">{t('verification')}</span>
                    </div>
                    <ArrowRight className="h-6 w-6 md:hidden" />
                </button>
                {/* <button className="flex w-full flex-row items-center justify-between rounded-lg bg-[#FFFFFF] p-4  shadow-md md:bg-[#F5F5F5] md:p-0 md:shadow-none">
                    <div className="flex flex-row items-center">
                        <Setting className=" h-6 w-6" />
                        <span className="ml-3">{t('editProfile')}</span>
                    </div>
                    <ArrowRight className="h-6 w-6 md:hidden" />
                </button> */}
                <button
                    onClick={signOutHandler}
                    className="flex w-full flex-row items-center justify-between rounded-lg bg-[#FFFFFF] p-4  shadow-md md:bg-[#F5F5F5] md:p-0 md:shadow-none"
                >
                    <div className="flex flex-row items-center">
                        <Logout className=" h-6 w-6" />
                        <span className="ml-3 text-[#DB0505]">{t('logOut')}</span>
                    </div>
                </button>
                {/* <button className="flex w-full flex-row items-center justify-between rounded-lg bg-[#F2F5FF] p-4 shadow-md md:p-0 md:shadow-none">
                    <div className="flex flex-row items-center">
                        <ShieldSlash className=" h-6 w-6 fill-[#838CAC]" />
                        <span className="ml-3 md:text-[#838CAC]">{t('deleteProfile')}</span>
                    </div>
                </button> */}
            </div>
        </section>
    )
}
