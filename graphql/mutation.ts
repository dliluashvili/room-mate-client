import { TypedDocumentNode, gql } from '@apollo/client'
import {
    Mutation,
    MutationSendCodeBySmsArgs,
    MutationRefreshTokenArgs,
    MutationRoommateSignUpArgs,
    MutationVerifyCodeBySmsArgs,
    MutationRoommateSignInArgs,
    MutationLandlordSignUpArgs,
    MutationSendCodeByEmailArgs,
    MutationVerifyCodeByEmailArgs,
    MutationRoommateSendResetPasswordVerificationCodeArgs,
    MutationLandlordSendResetPasswordVerificationCodeArgs,
    MutationResetPasswordArgs,
    MutationVerifyResetPasswordVerificationCodeArgs,
    MutationUpsertPropertyArgs,
    MutationUpdateConversationStatusArgs,
    MutationLookupOrCreateTwilioUserResourceArgs,
    MutationUpdateConversationResourceStateArgs,
    MutationIdentityVerificationImagesUploadArgs,
    MutationRemovePropertyArgs,
} from './typesGraphql'

export const RoommateSignUpMutation: TypedDocumentNode<
    { roommateSignUp: Mutation['roommateSignUp'] },
    MutationRoommateSignUpArgs
> = gql`
    mutation RoommateSignUp($input: RoommateSignUpInput!) {
        roommateSignUp(input: $input) {
            id
            email
            phone
            firstname
            lastname
            birthDate
            genderId
            countryId
            profileImage
            userTypes
            createdAt
            jwt {
                accessToken
                refreshToken
                sessionId
            }
        }
    }
`

export const RoommateSignIn: TypedDocumentNode<
    { roommateSignIn: Mutation['roommateSignIn'] },
    MutationRoommateSignInArgs
> = gql`
    mutation RoommateSignIn($input: SignInCredentialsInput!) {
        roommateSignIn(input: $input) {
            accessToken
            refreshToken
            sessionId
        }
    }
`

export const LandlordSignIn: TypedDocumentNode<
    { landlordSignIn: Mutation['landlordSignIn'] },
    MutationRoommateSignInArgs
> = gql`
    mutation RoommateSignIn($input: SignInCredentialsInput!) {
        landlordSignIn(input: $input) {
            accessToken
            refreshToken
            sessionId
        }
    }
`

export const LandlordSignUp: TypedDocumentNode<
    { landlordSignUp: Mutation['landlordSignUp'] },
    MutationLandlordSignUpArgs
> = gql`
    mutation LandlordSignUp($input: LandlordSignUpInput!) {
        landlordSignUp(input: $input) {
            id
            email
            phone
            firstname
            lastname
            birthDate
            genderId
            countryId
            profileImage
            userTypes
            createdAt
            jwt {
                accessToken
                refreshToken
                sessionId
            }
        }
    }
`

export const SendCodeByEmail: TypedDocumentNode<
    { sendCodeByEmail: Mutation['sendCodeByEmail'] },
    MutationSendCodeByEmailArgs
> = gql`
    mutation SendCodeByEmail($input: SendCodeByEmailInput!) {
        sendCodeByEmail(input: $input) {
            status
        }
    }
`

export const SendCodeBySms: TypedDocumentNode<
    { sendCodeBySms: Mutation['sendCodeBySms'] },
    MutationSendCodeBySmsArgs
> = gql`
    mutation SendCodeBySms($input: SendCodeInput!) {
        sendCodeBySms(input: $input) {
            status
        }
    }
`

export const VerifyCodeByEmail: TypedDocumentNode<
    { verifyCodeByEmail: Mutation['verifyCodeByEmail'] },
    MutationVerifyCodeByEmailArgs
> = gql`
    mutation VerifyCodeByEmail($input: VerifyCodeByEmailInput!) {
        verifyCodeByEmail(input: $input) {
            status
        }
    }
`

export const VerifyCodeBySms: TypedDocumentNode<
    { verifyCodeBySms: Mutation['verifyCodeBySms'] },
    MutationVerifyCodeBySmsArgs
> = gql`
    mutation VerifyCodeBySms($input: VerifyCodeInput!) {
        verifyCodeBySms(input: $input) {
            status
        }
    }
`

export const RefreshTokenMutation: TypedDocumentNode<
    { refreshToken: Mutation['refreshToken'] },
    MutationRefreshTokenArgs
> = gql`
    mutation RefreshToken($input: RefreshTokenInput!) {
        refreshToken(input: $input) {
            accessToken
            refreshToken
            sessionId
        }
    }
`

export const RoommateResetPasswordCode: TypedDocumentNode<
    {
        roommateSendResetPasswordVerificationCode: Mutation['roommateSendResetPasswordVerificationCode']
    },
    MutationRoommateSendResetPasswordVerificationCodeArgs
> = gql`
    mutation RoommateSendResetPasswordVerificationCode(
        $input: SendResetPasswordVerificationCodeInput!
    ) {
        roommateSendResetPasswordVerificationCode(input: $input) {
            status
        }
    }
`

export const LandlordResetPasswordCode: TypedDocumentNode<
    {
        landlordSendResetPasswordVerificationCode: Mutation['landlordSendResetPasswordVerificationCode']
    },
    MutationLandlordSendResetPasswordVerificationCodeArgs
> = gql`
    mutation LandlordSendResetPasswordVerificationCode(
        $input: SendResetPasswordVerificationCodeInput!
    ) {
        landlordSendResetPasswordVerificationCode(input: $input) {
            status
        }
    }
`

export const ResetPassword: TypedDocumentNode<
    {
        resetPassword: Mutation['resetPassword']
    },
    MutationResetPasswordArgs
> = gql`
    mutation ResetPassword($input: ResetPasswordInput!) {
        resetPassword(input: $input)
    }
`

export const ResetPasswordVerifyCode: TypedDocumentNode<
    {
        verifyResetPasswordVerificationCode: Mutation['verifyResetPasswordVerificationCode']
    },
    MutationVerifyResetPasswordVerificationCodeArgs
> = gql`
    mutation VerifyResetPasswordVerificationCode(
        $input: VerifyResetPasswordVerificationCodeInput!
    ) {
        verifyResetPasswordVerificationCode(input: $input) {
            status
        }
    }
`

export const UpsertProperty: TypedDocumentNode<
    {
        upsertProperty: Mutation['upsertProperty']
    },
    MutationUpsertPropertyArgs
> = gql`
    mutation UpsertProperty($input: UpsertPropertyInput!) {
        upsertProperty(input: $input)
    }
`

export const generateTwilioAccessTokenMutation = gql`
    mutation GenerateTwilioAccessToken {
        generateTwilioAccessToken
    }
`

export const generateTwilioAccessTokenByIdMutation = gql`
    mutation GenerateTwilioAccessTokenById($id: Float!) {
        generateTwilioAccessTokenById(id: $id)
    }
`

export const logConnectionErrorMutation = gql`
    mutation LogConnectionError($error: String!) {
        logConnectionError(error: $error)
    }
`

export const updateConversationStatusMutation: TypedDocumentNode<
    { updateConversationStatus: Mutation['updateConversationStatus'] },
    MutationUpdateConversationStatusArgs
> = gql`
    mutation UpdateConversationStatusMutation(
        $conversationId: String!
        $status: ConversationStatus!
    ) {
        updateConversationStatus(conversationId: $conversationId, status: $status)
    }
`

export const lookupOrCreateTwilioUserResourceMutation: TypedDocumentNode<
    {
        lookupOrCreateTwilioUserResource: Mutation['lookupOrCreateTwilioUserResource']
    },
    MutationLookupOrCreateTwilioUserResourceArgs
> = gql`
    mutation Mutation($userId: String!) {
        lookupOrCreateTwilioUserResource(userId: $userId)
    }
`

export const updateConversationResourceStateMutation: TypedDocumentNode<
    {
        updateConversationResourceState: Mutation['updateConversationResourceState']
    },
    MutationUpdateConversationResourceStateArgs
> = gql`
    mutation UpdateConversationResourceState($sid: String!, $state: String!) {
        updateConversationResourceState(sid: $sid, state: $state) {
            sid
            state
            dateCreated
            dateUpdated
        }
    }
`

export const identityVerificationImagesUpload: TypedDocumentNode<
    {
        identityVerificationImagesUpload: Mutation['identityVerificationImagesUpload']
    },
    MutationIdentityVerificationImagesUploadArgs
> = gql`
    mutation IdentityVerificationImagesUpload($input: IdentityUploadInput!) {
        identityVerificationImagesUpload(input: $input)
    }
`

export const RemoveProperty: TypedDocumentNode<
    {
        removeProperty: Mutation['removeProperty']
    },
    MutationRemovePropertyArgs
> = gql`
    mutation RemoveProperty($propertyId: String!, $isSoftRemove: Boolean) {
        removeProperty(propertyId: $propertyId, isSoftRemove: $isSoftRemove)
    }
`
