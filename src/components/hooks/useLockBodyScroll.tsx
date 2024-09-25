import { useLayoutEffect } from "react"


export function useLockBodyScroll(lock: boolean) {
    useLayoutEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow

        if (lock) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = originalStyle
        }

        return () => {
            document.body.style.overflow = originalStyle
        }
    }, [lock])
}
