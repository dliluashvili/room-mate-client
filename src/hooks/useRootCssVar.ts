import { useState, useEffect } from 'react'

const useRootCssVar = (varName: string): string => {
    const [value, setValue] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = document.documentElement
            const style = getComputedStyle(root)
            const color = style.getPropertyValue(varName).trim()

            setValue(color)
        }
    }, [varName])

    return value
}

export { useRootCssVar }
