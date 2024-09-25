import { client } from '../libs/apollo/client'
import { removeAllTokens } from './authHelpers'
import { isAuthenticatedVar } from './isAuthenticatedVar'

export const signOutHandler = () => {
    removeAllTokens()
    isAuthenticatedVar({ checking: false, valid: false })
    client().cache.evict({ id: 'ROOT_QUERY', fieldName: 'me' })
    client().cache.gc()
    client().clearStore()
}
