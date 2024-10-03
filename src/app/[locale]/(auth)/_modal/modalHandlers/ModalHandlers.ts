import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const useModalHandlers = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const modalCloseHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.delete('modal')

        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    const signinRoommatesHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('modal', 'signinRoommates')
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    const signinLandlordsHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('modal', 'signinLandlords')
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    const signupLandlordsHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('modal', 'signupLandlords')
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    const signupRoommatesHandler = () => {
        router.push('/signup')
    }

    const signupChoosTypeHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('modal', 'signupChooseType')
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    const signinChoosTypeHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('modal', 'signinRoommates')
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    const landlordsResetPasswordHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('modal', 'resetPasswordLandlords')
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    const roommatesResetPasswordHandler = useCallback(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('modal', 'resetPasswordRoommates')
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }, [searchParams, router, pathname])

    return {
        modalCloseHandler,
        signinRoommatesHandler,
        signinLandlordsHandler,
        signupLandlordsHandler,
        signupRoommatesHandler,
        signupChoosTypeHandler,
        signinChoosTypeHandler,
        landlordsResetPasswordHandler,
        roommatesResetPasswordHandler,
    }
}
