import { useEffect, useState } from 'react'
import { useReactiveVar, useQuery } from '@apollo/client'
import { getAccessToken } from './authHelpers'
import Loading from '@/src/app/[locale]/loading'
import { refreshTokens } from './refreshTokens'
import { isTokenExpired } from '../utils/isTokenExpired'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { isAuthenticatedVar } from './isAuthenticatedVar'
import { getUserQuery } from '@/graphql/query'
import { UserType } from '@/graphql/typesGraphql'

export const withAuth = (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
        const router = useRouter()
        const pathname = usePathname()
        const params = useParams()
        const locale = params.locale as string
        const [isValidating, setIsValidating] = useState(true)
        const isAuthenticated = useReactiveVar(isAuthenticatedVar)
        const { data: user, loading: userLoading } = useQuery(getUserQuery)

        useEffect(() => {
            async function checkAuth() {
                const accessToken = getAccessToken()

                if (!accessToken || isTokenExpired(accessToken)) {
                    await refreshTokens()
                }

                setTimeout(() => setIsValidating(false), 100)
            }

            checkAuth()
        }, [])

        useEffect(() => {
            const roommatePaths = ['/profile']
            const roommatesOnly = ['/roommates']

            const landlordPaths = [
                '/upload-apartment',
                '/apartment-list',
                '/landlord-profile',
                '/landlords',
            ]

            const isLandlordPath = landlordPaths.some((path) => {
                const pathWithoutLocale = pathname.replace(`/${locale}`, '')
                return pathWithoutLocale === path || pathname === path
            })

            const isRoommatePath = roommatePaths.some((path) => {
                const pathWithoutLocale = pathname.replace(`/${locale}`, '')
                return pathWithoutLocale === path || pathname === path
            })

            const separatlyRoommates = roommatesOnly.some((path) => {
                const pathWithoutLocale = pathname.replace(`/${locale}`, '')
                return pathWithoutLocale === path || pathname === path
            })

            if (!isAuthenticated.valid) {
                if (isLandlordPath) {
                    router.replace('/landlords?modal=signinLandlords')
                } else if (isRoommatePath) {
                    router.replace('/?modal=signinRoommates')
                } else if (separatlyRoommates) {
                    router.replace('/signup')
                }
                return
            }

            if (userLoading) return

            const checkPathAndRedirect = (paths: string[], redirectPath: string) => {
                const matchPath = paths.some((path) => {
                    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
                    return pathWithoutLocale === path || pathname === path
                })

                if (matchPath) {
                    router.replace(redirectPath)
                }
            }

            if (user?.me.userTypes.includes(UserType.Landlord)) {
                checkPathAndRedirect(roommatePaths, '/?modal=signinRoommates')
            } else if (user?.me.userTypes.includes(UserType.Roommate)) {
                checkPathAndRedirect(landlordPaths, '/?modal=signinLandlords')
            }
        }, [isAuthenticated.valid, user, userLoading, pathname, locale, router])

        if (isValidating || userLoading) {
            return <Loading />
        }

        return <WrappedComponent {...props} />
    }
}
