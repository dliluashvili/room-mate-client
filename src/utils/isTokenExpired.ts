import { jwtDecode } from 'jwt-decode'

export const isTokenExpired = (token: string | null): boolean => {
    try {
        if (token === null) {
            return false
        }

        const decodedToken: any = jwtDecode(token)
        if (!decodedToken.exp) return true

        return decodedToken.exp * 1000 < Date.now()
    } catch (error) {
        return true
    }
}
