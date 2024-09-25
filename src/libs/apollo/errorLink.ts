import { FetchResult, NextLink, Observable, Operation } from '@apollo/client'

import { onError } from '@apollo/client/link/error'
import { errorCodes, exceptionCodes } from '@/src/constants/errors'
import { refreshTokens } from '@/src/auth/refreshTokens'
import { getAccessToken, getRefreshToken } from '@/src/auth/authHelpers'
import { GraphQLFormattedError } from 'graphql'
import { SubscriptionObserver } from 'zen-observable-ts'

const hasRefreshTokenError = (errors: readonly GraphQLFormattedError[] | undefined) => {
    return errors?.some(
        (error) => error.extensions?.errorCode === errorCodes.refreshToken.token.invalid
    )
}

const hasUnauthenticatedError = (errors: readonly GraphQLFormattedError[] | undefined) => {
    return errors?.some((error) => error.extensions?.code === exceptionCodes.unauthenticated)
}

const handleTokenRefresh = async (
    observer: SubscriptionObserver<FetchResult>,
    operation: Operation,
    forward: NextLink
) => {
    try {
        const tokenRefreshed = await refreshTokens()

        if (tokenRefreshed) {
            const accessToken = getAccessToken()

            operation.setContext({
                headers: {
                    ...operation.getContext().headers,
                    authorization: `Bearer ${accessToken}`,
                },
            })

            const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
            }

            forward(operation).subscribe(subscriber)
        }
    } catch (error) {
        observer.error(error)
    }
}

export const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
        if (!hasRefreshTokenError(graphQLErrors) && hasUnauthenticatedError(graphQLErrors)) {
            const refreshToken = getRefreshToken()

            if (refreshToken) {
                return new Observable((observer) => {
                    handleTokenRefresh(observer, operation, forward)
                })
            }
        }
    }
})
