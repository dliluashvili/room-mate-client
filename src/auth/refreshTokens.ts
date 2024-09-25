import { RefreshTokenMutation } from '@/graphql/mutation'
import { JwtObject } from '@/graphql/typesGraphql'
import {
    getRefreshToken,
    getSessionId,
    removeAllTokens,
    setRefreshToken,
    setSessionId,
    setAccessToken,
} from './authHelpers'
import { client } from '@/src/libs/apollo/client'
import { isAuthenticatedVar } from './isAuthenticatedVar'

const handleSuccessfulRefresh = (
    tokenData: JwtObject,
    isAuthenticated: ReturnType<typeof isAuthenticatedVar>
): boolean => {
    setAccessToken(tokenData.accessToken)
    setRefreshToken(tokenData.refreshToken)
    setSessionId(tokenData.sessionId)
    isAuthenticatedVar({ ...isAuthenticated, checking: false, valid: true })

    return true
}

const handleAuthenticationFailure = (
    isAuthenticated: ReturnType<typeof isAuthenticatedVar>
): boolean => {
    removeAllTokens()
    isAuthenticatedVar({ ...isAuthenticated, checking: false, valid: false })

    return false
}

export const refreshTokens = async (): Promise<boolean> => {
    const refreshToken = getRefreshToken()
    const sessionId = getSessionId()
    const isAuthenticated = isAuthenticatedVar()

    if (!refreshToken || !sessionId) {
        return handleAuthenticationFailure(isAuthenticated)
    }

    try {
        const { data } = await client().mutate({
            mutation: RefreshTokenMutation,
            variables: {
                input: { sessionId, refreshToken },
            },
        })

        if (data?.refreshToken) {
            return handleSuccessfulRefresh(data.refreshToken, isAuthenticated)
        }
    } catch (error) {
        console.error('Token refresh failed:', error)
    }

    return handleAuthenticationFailure(isAuthenticated)
}
