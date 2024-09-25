import { JwtObject } from '@/graphql/typesGraphql'
import { setAccessToken, setRefreshToken, setSessionId } from './authHelpers'
import { isAuthenticatedVar } from './isAuthenticatedVar'

export const signIn = (jwt: JwtObject) => {
    setAccessToken(jwt.accessToken)
    setRefreshToken(jwt.refreshToken)
    setSessionId(jwt.sessionId)

    isAuthenticatedVar({ checking: false, valid: true })
}
