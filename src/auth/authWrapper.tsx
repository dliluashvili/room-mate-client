'use client'

import { PropsWithChildren, useEffect } from 'react'
import { isTokenExpired } from '@/src/utils/isTokenExpired'
import { getAccessToken } from './authHelpers'
import { refreshTokens } from './refreshTokens'
import { isAuthenticatedVar } from './isAuthenticatedVar'

export const AuthWrapper = ({ children }: PropsWithChildren) => {
    async function checkAuth() {
        const accessToken = getAccessToken()

        if (!accessToken || isTokenExpired(accessToken)) {
            await refreshTokens()
        } else {
            isAuthenticatedVar({ valid: true, checking: false })
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return <>{children}</>
}
