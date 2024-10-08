'use client'

import { useTranslation } from 'react-i18next'
import { Logo, Messenger, UserIcon2 } from '../svgs'
import LangChoose from './components/LangChoose'
import MobileNavBar from './components/MobileNavBar'
import Link from 'next/link'
import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import { isAuthenticatedVar } from '@/src/auth/isAuthenticatedVar'
import { getConversationsForUserQuery, getUserQuery } from '@/graphql/query'
import { LIMIT, OFFSET } from '@/src/constants/pagination'
import { UserType } from '@/graphql/typesGraphql'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

export default function Header() {
    const { t } = useTranslation()

    const [isClient, setIsClient] = useState(false)
    const [isLoadingUser, setIsLoadingUser] = useState(true)
    const authStatus = useReactiveVar(isAuthenticatedVar)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const isLandlordsPath =
        pathname.includes('/landlords') ||
        pathname.includes('/upload-apartment') ||
        pathname.includes('/apartment-list') ||
        pathname.includes('/landlord-profile')

    const isRoommatesPath = !isLandlordsPath

    let unreadMessagesCount = 0

    const {
        data: user,
        loading: userLoading,
        refetch: refetchUser,
    } = useQuery(getUserQuery, {
        skip: !authStatus.valid,
    })

    const [getConversationsForUser, { data }] = useLazyQuery(getConversationsForUserQuery, {
        variables: {
            pagination: {
                limit: LIMIT,
                offset: OFFSET,
            },
        },
        fetchPolicy: 'cache-only',
    })

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        setIsLoadingUser(false)
    }, [userLoading])

    useEffect(() => {
        if (user) {
            getConversationsForUser()
        }
    }, [user])

    useEffect(() => {
        refetchUser()
    }, [authStatus])

    const handleLinkClick = (e: MouseEvent<HTMLButtonElement>, href: string) => {
        if (pathname === '/signup') {
            e.preventDefault()
            const leave = window.confirm(t('leavePageQuestion') + '\n' + t('leavingPageAlert'))
            if (leave) {
                router.push(href)
            }
        } else {
            router.push(href)
        }
    }

    const signinModalHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('modal', 'signinChooseType')
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    const signupModalHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('modal', 'signupChooseType')
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    unreadMessagesCount =
        data?.getConversationsForUser?.list?.reduce((acc, conversation) => {
            return acc + conversation?.unreadMessagesCount ?? 0
        }, 0) ?? 0

    const renderAuthSection = () => {
        if (!isClient || isLoadingUser) {
            return <div>Loading...</div>
        }

        if (authStatus.checking) {
            return <div>Loading...</div>
        }

        if (authStatus.valid && user) {
            if (isLandlordsPath && user.me.userTypes.includes(UserType.Landlord)) {
                return (
                    <>
                        <Link href="/upload-apartment">
                            <span className="cursor-pointer  text-base text-[#838CAC]">
                                {t('uploadApartment')}
                            </span>
                        </Link>
                        <Link href="/landlord-profile">
                            <button className="hidden flex-row items-center rounded-lg bg-mainOrange p-2 text-white md:flex xl:px-3 xl:py-2">
                                <UserIcon2 className="h-4 w-4 fill-white xl:h-6 xl:w-6" />
                                <span className="ml-1 text-xs xl:text-base">
                                    {user.me.firstname}
                                </span>
                            </button>
                        </Link>
                    </>
                )
            }

            if (isRoommatesPath && user.me.userTypes.includes(UserType.Roommate)) {
                return (
                    <>
                        <Link href="/roommates" className="hidden md:block">
                            <span className="cursor-pointertext-base text-sm text-[#838CAC]">
                                {t('findRoommate')}
                            </span>
                        </Link>
                        <Link href="/apartments" className="hidden md:block">
                            <span className="cursor-pointer text-sm text-[#838CAC]">
                                {t('rentApartment')}
                            </span>
                        </Link>
                        <Link href="/profile">
                            <button className=" flex flex-row  items-center rounded-lg bg-[#F2F5FF] p-2 text-[#838CAC] md:flex xl:px-3 xl:py-2">
                                <UserIcon2 className="h-4 w-4 fill-[#838CAC] xl:h-6 xl:w-6" />
                                <span className="ml-1 text-xs xl:text-base">
                                    {user.me.firstname}
                                </span>
                            </button>
                        </Link>
                    </>
                )
            }
        }

        if (
            isRoommatesPath &&
            (user?.me.userTypes.includes(UserType.Landlord) || !authStatus.valid)
        ) {
            return (
                <>
                    <button
                        onClick={signupModalHandler}
                        className="hidden flex-row items-center rounded-lg bg-[#F2F5FF] p-2 text-[#838CAC] md:flex xl:px-3 xl:py-2"
                    >
                        <UserIcon2 className="h-4 w-4 fill-[#838CAC] xl:h-6 xl:w-6" />
                        <span className="ml-1 text-xs xl:text-base">{t('signUp')}</span>
                    </button>

                    <button
                        onClick={signinModalHandler}
                        className="hidden flex-row items-center rounded-lg bg-[#F2F5FF] p-2 text-[#838CAC] md:flex xl:px-3 xl:py-2"
                    >
                        <UserIcon2 className="h-4 w-4 fill-[#838CAC] xl:h-6 xl:w-6" />
                        <span className="ml-1 text-xs xl:text-base">{t('signIn')}</span>
                    </button>
                </>
            )
        }

        if (
            isLandlordsPath &&
            (user?.me.userTypes.includes(UserType.Roommate) || !authStatus.valid)
        ) {
            return (
                <>
                    <button
                        onClick={signupModalHandler}
                        className="hidden flex-row items-center rounded-lg bg-mainOrange p-2 text-white md:flex xl:px-3 xl:py-2"
                    >
                        <UserIcon2 className="h-4 w-4 fill-white xl:h-6 xl:w-6" />
                        <span className="ml-1 text-xs xl:text-base">{t('signUp')}</span>
                    </button>

                    <button
                        onClick={signinModalHandler}
                        className="hidden flex-row items-center rounded-lg bg-mainOrange p-2 text-white md:flex xl:px-3 xl:py-2"
                    >
                        <UserIcon2 className="h-4 w-4 fill-white xl:h-6 xl:w-6" />
                        <span className="ml-1 text-xs xl:text-base">{t('signIn')}</span>
                    </button>
                </>
            )
        }
    }

    const handleToggle = () => {
        if (isLandlordsPath) {
            router.push('/')
        } else {
            router.push('/landlords')
        }
    }

    return (
        <>
            <header
                className={`flex w-full flex-row items-center justify-between px-6 py-3 shadow-md sm:px-16 md:px-20 md:py-3 xl:px-24 xl:py-6 ${
                    isLandlordsPath ? 'bg-[#C0DBFC]' : 'bg-[headerBg]'
                }`}
            >
                <div className=" items-center gap-10 md:flex">
                    <Link href={isLandlordsPath ? '/landlords' : '/'}>
                        <Logo
                            className={` ${isLandlordsPath ? 'fill-mainOrange' : 'fill-mainGreen'} h-6 w-[120px] cursor-pointer  md:h-7 md:w-[140px] xl:block xl:h-10 xl:w-[200px]`}
                        />
                    </Link>

                    <div className="hidden items-center gap-2  md:flex">
                        <Label
                            htmlFor="navigation-switch"
                            className={`transition-opacity ${!isLandlordsPath ? 'text-mainGreen opacity-100' : 'opacity-50'} md:text-sm `}
                        >
                            {t('lookingForRoommate')}
                        </Label>
                        <Switch
                            id="navigation-switch"
                            checked={isLandlordsPath}
                            onCheckedChange={handleToggle}
                        />
                        <Label
                            htmlFor="navigation-switch"
                            className={`transition-opacity ${isLandlordsPath ? 'text-mainOrange opacity-100' : 'opacity-50'} md:text-sm `}
                        >
                            {t('propertyOwner')}
                        </Label>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 md:gap-4">
                    {renderAuthSection()}

                    <LangChoose
                        className={` ${isLandlordsPath ? 'border border-mainOrange' : ' '} cursor-pointer rounded-lg bg-[#f2f5ff] p-2 text-xs text-[#838CAC] lg:p-2 xl:text-base`}
                        spanClassname="text-xs xl:text-base"
                    />
                    {user?.me?.id && user?.me.userTypes.includes(UserType.Roommate) ? (
                        <button
                            className="pointer relative flex items-center justify-center rounded-lg bg-[#f2f5ff] p-2 md:flex xl:px-3 xl:py-2"
                            onClick={(e) => {
                                handleLinkClick(e, '/conversation')
                            }}
                        >
                            <Messenger className="h-4 w-4 xl:h-6 xl:w-6" />

                            {!!unreadMessagesCount && (
                                <div className="absolute -right-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs  font-semibold text-white">
                                    {unreadMessagesCount}
                                </div>
                            )}
                        </button>
                    ) : null}
                    <button className="ml-2 block md:hidden">
                        <MobileNavBar
                            isRoommatesPath={isRoommatesPath}
                            isLandlordsPath={isLandlordsPath}
                            handleToggle={handleToggle}
                        />
                    </button>
                </div>
            </header>
        </>
    )
}
