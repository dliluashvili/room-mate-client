import { UserAnsweredQuestionObject } from '@/graphql/typesGraphql'

type CountryId = number | { value: number }
type GenderId = number | { value: number }
type ProfileImage = Array<{ path: string }> | string

export type NewAnsweredQuestion = {
    questionId: string
    data?: string
    answerIds?: any[]
    dataRange?: any[]
}
export interface CustomError extends Error {
    message: string
}
export type CombinedAnsweredQuestions = UserAnsweredQuestionObject & {
    [key: string]: string | Array<any> | { questionId: string; value: string | number }
}
type UserAnsweredQuestionObjectStart = {
    answeredQuestions: {
        [key: string]: string | Array<any> | { questionId: string; value: string | number }
    }
}

export type FormDataProps = {
    answeredQuestions: CombinedAnsweredQuestions | UserAnsweredQuestionObjectStart
    countryId?: CountryId
    genderId?: GenderId
    profileImage?: string
    code?: string
    email?: string
    phone?: string
    birthDate: string
    firstname?: string
    lastname?: string
    confirmPassword?: string
    password?: string
}
