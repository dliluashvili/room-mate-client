'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'
import { BurgerIcon, EmailIcon, PhoneIcon } from '@/src/components/svgs'
import { Sheet, SheetContent, SheetTrigger } from '@/src/components/ui/sheet'
import { SocialIcons } from '@/src/components/shared/socialIcons/SocialIcons'
import { getUserQuery } from '@/graphql/query'
import { useQuery, useReactiveVar } from '@apollo/client'
import { isAuthenticatedVar } from '@/src/auth/isAuthenticatedVar'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { UserType } from '@/graphql/typesGraphql'
import { signOutHandler } from '@/src/auth/signOut'

export default function MobileNavBar({ isRoommatesPath, isLandlordsPath, handleToggle }: any) {
    const { t } = useTranslation()
    const pathname = usePathname()
    const localePattern = /^\/(en|ka)(\/|$)/
    const pathnameWithoutLocale = pathname.replace(localePattern, '/')
    const authStatus = useReactiveVar(isAuthenticatedVar)
    const { data: user, loading: userLoading } = useQuery(getUserQuery, {
        skip: !authStatus.valid,
    })
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="h-4 w-4">
                    <BurgerIcon className="h-full w-full" />
                </div>
            </SheetTrigger>
            <SheetContent className="flex max-h-screen w-72 flex-col items-start overflow-y-auto bg-[#F2F5FF] px-6 pb-14 pt-3">
                <div className="mt-10 flex flex-col gap-y-6 text-[14px]">
                    <div className=" flex items-center gap-5">
                        <Label
                            htmlFor="navigation-switch"
                            className={`transition-opacity ${!isLandlordsPath ? 'text-mainGreen opacity-100' : 'opacity-50'} text-xs`}
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
                            className={`transition-opacity ${isLandlordsPath ? 'text-mainOrange opacity-100' : 'opacity-50'} text-xs`}
                        >
                            {t('propertyOwner')}
                        </Label>
                    </div>

                    <SheetTrigger asChild>
                        {isRoommatesPath ? (
                            <Link href="/">
                                <span
                                    className="text-xs"
                                    style={{
                                        fontWeight:
                                            pathnameWithoutLocale === '/' ? 'bold' : 'normal',
                                    }}
                                >
                                    {t('main')}
                                </span>
                            </Link>
                        ) : (
                            <Link href="/landlords">
                                <span
                                    className="text-xs"
                                    style={{
                                        fontWeight:
                                            pathnameWithoutLocale === '/landlords'
                                                ? 'bold'
                                                : 'normal',
                                    }}
                                >
                                    {t('main')}
                                </span>
                            </Link>
                        )}
                    </SheetTrigger>

                    <SheetTrigger asChild>
                        {authStatus &&
                        user?.me.userTypes.includes(UserType.Roommate) &&
                        isRoommatesPath ? (
                            <Link href="/profile">
                                <span
                                    className="text-xs"
                                    style={{
                                        fontWeight:
                                            pathnameWithoutLocale === '/profile' ? 'bold' : '',
                                    }}
                                >
                                    {t('profile')}
                                </span>
                            </Link>
                        ) : authStatus &&
                          user?.me.userTypes.includes(UserType.Landlord) &&
                          isLandlordsPath ? (
                            <Link href="/landlord-profile">
                                <span
                                    className="text-xs"
                                    style={{
                                        fontWeight:
                                            pathnameWithoutLocale === '/landlord-profile'
                                                ? 'bold'
                                                : '',
                                    }}
                                >
                                    {t('profile')}
                                </span>
                            </Link>
                        ) : null}
                    </SheetTrigger>

                    {isRoommatesPath && !user?.me.userTypes.includes(UserType.Roommate) && (
                        <SheetTrigger asChild>
                            <Link href="?modal=signinRoommates">
                                <span className="text-xs">{t('signIn')}</span>
                            </Link>
                        </SheetTrigger>
                    )}
                    {isLandlordsPath && !user?.me.userTypes.includes(UserType.Landlord) && (
                        <SheetTrigger asChild>
                            <Link href="?modal=signinLandlords">
                                <span className="text-xs">{t('signIn')}</span>
                            </Link>
                        </SheetTrigger>
                    )}
                    {isLandlordsPath && !user?.me.userTypes.includes(UserType.Landlord) && (
                        <SheetTrigger asChild>
                            <Link href="?modal=signupLandlords">
                                <span className="text-xs">{t('signUp')}</span>
                            </Link>
                        </SheetTrigger>
                    )}
                    {isRoommatesPath && !user?.me.userTypes.includes(UserType.Roommate) && (
                        <SheetTrigger asChild>
                            <Link href="/signup">
                                <span
                                    className={`${pathname === '/signup' ? 'font-bold' : ''} text-xs`}
                                >
                                    {t('signUp')}
                                </span>
                            </Link>
                        </SheetTrigger>
                    )}
                    <SheetTrigger asChild>
                        {isRoommatesPath ? (
                            <Link href="/roommates">
                                <span
                                    className="text-xs"
                                    style={{
                                        fontWeight:
                                            pathnameWithoutLocale === '/roommates' ? 'bold' : '',
                                    }}
                                >
                                    {t('findRoommate')}
                                </span>
                            </Link>
                        ) : (
                            <Link href="/upload-apartment">
                                <span
                                    className="text-xs"
                                    style={{
                                        fontWeight:
                                            pathnameWithoutLocale === '/upload-apartment'
                                                ? 'bold'
                                                : '',
                                    }}
                                >
                                    {t('uploadApartment')}
                                </span>
                            </Link>
                        )}
                    </SheetTrigger>
                    <SheetTrigger asChild>
                        {isRoommatesPath ? (
                            <Link href="/apartments">
                                <span
                                    className="text-xs"
                                    style={{
                                        fontWeight:
                                            pathnameWithoutLocale === '/apartments' ? 'bold' : '',
                                    }}
                                >
                                    {t('rentApartment')}
                                </span>
                            </Link>
                        ) : (
                            <>
                                {!authStatus && isLandlordsPath && (
                                    <Link href="/apartment-list">
                                        <span
                                            className="text-xs"
                                            style={{
                                                fontWeight:
                                                    pathnameWithoutLocale === '/apartment-list'
                                                        ? 'bold'
                                                        : '',
                                            }}
                                        >
                                            {t('myListings')}
                                        </span>
                                    </Link>
                                )}
                            </>
                        )}
                    </SheetTrigger>
                    {isRoommatesPath && user?.me.userTypes.includes(UserType.Roommate) && (
                        <SheetTrigger asChild>
                            <Link href={`${isRoommatesPath ? '/' : '/landlords'}`}>
                                <span onClick={signOutHandler} className="text-xs">
                                    {t('signOut')}
                                </span>
                            </Link>
                        </SheetTrigger>
                    )}
                    {isLandlordsPath &&
                        user?.me.userTypes.includes(UserType.Landlord) &&
                        authStatus && (
                            <SheetTrigger asChild>
                                <Link href="/apartment-list">
                                    <span onClick={signOutHandler} className="text-xs">
                                        {t('myListings')}
                                    </span>
                                </Link>
                            </SheetTrigger>
                        )}
                    {isLandlordsPath && user?.me.userTypes.includes(UserType.Landlord) && (
                        <SheetTrigger asChild>
                            <span onClick={signOutHandler} className="text-xs">
                                {t('signOut')}
                            </span>
                        </SheetTrigger>
                    )}
                    {/* <SheetTrigger asChild>
                        <span className="text-xs">{t('becomePartner')}</span>
                    </SheetTrigger>
                    <SheetTrigger asChild>
                        <span className="text-xs">{t('faq')}</span>
                    </SheetTrigger>
                    <SheetTrigger asChild>
                        <span className="text-xs">{t('howItWorks')}</span>
                    </SheetTrigger> */}
                </div>
                <Link href="tel:+995599976385">
                    <div className="mt-[150px] flex flex-row">
                        <PhoneIcon />
                        <p className="ml-3 text-[14px] text-[#484848]">599 976 385</p>
                    </div>
                </Link>
                <Link href="mailto:info@roommate.ge">
                    <div className="-mt-2 mb-2 flex flex-row">
                        <EmailIcon />
                        <p className="ml-3  text-[14px] text-[#484848]">info@rommate.ge</p>
                    </div>
                </Link>
                <SocialIcons />
                <div className="h-[2px] w-full bg-[#DADDE7]"></div>
            </SheetContent>
        </Sheet>
    )
}
