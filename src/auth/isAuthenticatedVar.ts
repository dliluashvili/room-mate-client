import { makeVar } from '@apollo/client'

export const isAuthenticatedVar = makeVar({
    valid: true,
    checking: true,
})
