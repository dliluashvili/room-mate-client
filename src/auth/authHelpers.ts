export const setAccessToken = (token: string) => {
    localStorage.setItem('token', token)
}

export const setRefreshToken = (refreshToken: string) => {
    localStorage.setItem('refreshToken', refreshToken)
}

export const setSessionId = (sessionId: string) => {
    localStorage.setItem('sessionId', sessionId)
}

export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token')
    }
    return null
}

export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refreshToken')
    }
    return null
}

export const getSessionId = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('sessionId')
    }
    return null
}

export const removeAllTokens = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('sessionId')
    }
}
