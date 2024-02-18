export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
    T extends { [key: string]: unknown },
    K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends ' $fragmentName' | '__typename'
              ? T[P]
              : never;
      };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    DateTime: { input: any; output: any };
    JSON: { input: any; output: any };
    Lang: { input: any; output: any };
    StringTuple: { input: any; output: any };
};

export type Answer = {
    __typename?: 'Answer';
    createdAt: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    position: Scalars['Float']['output'];
    question: Question;
    translations?: Maybe<Array<AnswerTranslated>>;
    updatedAt: Scalars['DateTime']['output'];
    visible: Scalars['Boolean']['output'];
};

export type AnswerTranslated = {
    __typename?: 'AnswerTranslated';
    createdAt: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    lang: Scalars['Lang']['output'];
    title: Scalars['String']['output'];
    updatedAt: Scalars['DateTime']['output'];
};

export type CardInfo = {
    __typename?: 'CardInfo';
    bio: Scalars['String']['output'];
    budget: Scalars['Int']['output'];
    districtsName: Scalars['String']['output'];
};

export type CheckSmsCodeDto = {
    code: Scalars['Int']['input'];
    phone: Scalars['String']['input'];
};

export type Country = {
    __typename?: 'Country';
    id: Scalars['ID']['output'];
    translations: Array<CountryTranslated>;
    visible: Scalars['Boolean']['output'];
};

export type CountryTranslationsArgs = {
    lang?: InputMaybe<LangEnum>;
};

export type CountryTranslated = {
    __typename?: 'CountryTranslated';
    id: Scalars['ID']['output'];
    lang: Scalars['Lang']['output'];
    name: Scalars['String']['output'];
};

export type District = {
    __typename?: 'District';
    id: Scalars['ID']['output'];
    translations: Array<DistrictTranslated>;
    visible: Scalars['Boolean']['output'];
};

export type DistrictTranslationsArgs = {
    lang?: InputMaybe<LangEnum>;
};

export type DistrictTranslated = {
    __typename?: 'DistrictTranslated';
    id: Scalars['ID']['output'];
    lang: Scalars['Lang']['output'];
    name: Scalars['String']['output'];
};

export type FilterInput = {
    answerIds?: InputMaybe<Array<Scalars['String']['input']>>;
    columnName?: InputMaybe<Scalars['String']['input']>;
    data?: InputMaybe<Scalars['String']['input']>;
    dataRange?: InputMaybe<Scalars['StringTuple']['input']>;
    questionId?: InputMaybe<Scalars['String']['input']>;
};

export type FilterPagination = {
    __typename?: 'FilterPagination';
    data?: Maybe<Array<UserWithAdditionalInfo>>;
    pageInfo: PageInfo;
};

export type Gender = {
    __typename?: 'Gender';
    id: Scalars['ID']['output'];
    translations: Array<GenderTranslated>;
    visible: Scalars['Boolean']['output'];
};

export type GenderTranslationsArgs = {
    lang?: InputMaybe<LangEnum>;
};

export type GenderTranslated = {
    __typename?: 'GenderTranslated';
    id: Scalars['ID']['output'];
    lang: Scalars['Lang']['output'];
    sex: Scalars['String']['output'];
};

/** Language enumeration */
export enum LangEnum {
    En = 'EN',
    Ka = 'KA',
}

export type Mutation = {
    __typename?: 'Mutation';
    checkCode: VerificationCodeStatusCode;
    sendCode: SmsStatusCode;
    signUpAndAnswerQuestion: UserWithToken;
};

export type MutationCheckCodeArgs = {
    input: CheckSmsCodeDto;
};

export type MutationSendCodeArgs = {
    input: SendSmsCodeDto;
};

export type MutationSignUpAndAnswerQuestionArgs = {
    input: SignUpAndAnswerQuestionsInput;
};

export type PageInfo = {
    __typename?: 'PageInfo';
    hasNextPage: Scalars['Boolean']['output'];
    hasPrevious: Scalars['Boolean']['output'];
    limit: Scalars['Int']['output'];
    offset: Scalars['Int']['output'];
    page: Scalars['Int']['output'];
    total: Scalars['Int']['output'];
};

export type Query = {
    __typename?: 'Query';
    filterUsers?: Maybe<FilterPagination>;
    findAllCountry: Array<Country>;
    findAllDistrict: Array<District>;
    findAllGender: Array<Gender>;
    findAllUniversity: Array<University>;
    findOneCountry: Country;
    findOneDistrict: District;
    findOneGender: Gender;
    findOneUniversity: University;
    getQuestions?: Maybe<Array<Question>>;
    getUser: User;
};

export type QueryFilterUsersArgs = {
    input?: InputMaybe<Array<FilterInput>>;
    lang: LangEnum;
    limit?: Scalars['Int']['input'];
    offset?: Scalars['Int']['input'];
};

export type QueryFindAllCountryArgs = {
    visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryFindAllDistrictArgs = {
    visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryFindAllGenderArgs = {
    visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryFindAllUniversityArgs = {
    visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryFindOneCountryArgs = {
    id: Scalars['Int']['input'];
    visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryFindOneDistrictArgs = {
    id: Scalars['Int']['input'];
    visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryFindOneGenderArgs = {
    id: Scalars['Int']['input'];
    visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryFindOneUniversityArgs = {
    id: Scalars['Int']['input'];
    visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryGetQuestionsArgs = {
    lang?: InputMaybe<LangEnum>;
    visible?: Scalars['Boolean']['input'];
};

export type Question = {
    __typename?: 'Question';
    answers?: Maybe<Array<Answer>>;
    createdAt: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    position: Scalars['Float']['output'];
    translations?: Maybe<Array<QuestionTranslated>>;
    uiFieldInfo?: Maybe<Scalars['JSON']['output']>;
    updatedAt: Scalars['DateTime']['output'];
    visible: Scalars['Boolean']['output'];
};

export type QuestionTranslated = {
    __typename?: 'QuestionTranslated';
    createdAt: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    lang: Scalars['Lang']['output'];
    title: Scalars['String']['output'];
    updatedAt: Scalars['DateTime']['output'];
};

export type SendSmsCodeDto = {
    phone: Scalars['String']['input'];
};

export type SignUpAndAnswerQuestionsInput = {
    age: Scalars['Int']['input'];
    answeredQuestions: Array<UserAnsweredQuestionInput>;
    confirmPassword: Scalars['String']['input'];
    countryId: Scalars['Int']['input'];
    email?: InputMaybe<Scalars['String']['input']>;
    firstname: Scalars['String']['input'];
    genderId: Scalars['Int']['input'];
    lastname: Scalars['String']['input'];
    password: Scalars['String']['input'];
    phone: Scalars['String']['input'];
};

/** sms sending status code enumeration */
export enum SmsStatusCode {
    AlreadySent = 'ALREADY_SENT',
    Failed = 'FAILED',
    Success = 'SUCCESS',
}

export type University = {
    __typename?: 'University';
    id: Scalars['ID']['output'];
    translations: Array<UniversityTranslated>;
    visible: Scalars['Boolean']['output'];
};

export type UniversityTranslationsArgs = {
    lang?: InputMaybe<LangEnum>;
};

export type UniversityTranslated = {
    __typename?: 'UniversityTranslated';
    id: Scalars['ID']['output'];
    lang: Scalars['Lang']['output'];
    name: Scalars['String']['output'];
};

export type User = {
    __typename?: 'User';
    age: Scalars['Float']['output'];
    answeredQuestions?: Maybe<Array<UserAnsweredQuestion>>;
    available: Scalars['Boolean']['output'];
    callingCode: Scalars['String']['output'];
    countryId?: Maybe<Scalars['Float']['output']>;
    createdAt: Scalars['DateTime']['output'];
    email?: Maybe<Scalars['String']['output']>;
    firstname: Scalars['String']['output'];
    genderId?: Maybe<Scalars['Float']['output']>;
    id: Scalars['ID']['output'];
    isLockedCommunication: Scalars['Boolean']['output'];
    lastname: Scalars['String']['output'];
    password: Scalars['String']['output'];
    payed: Scalars['Boolean']['output'];
    phone: Scalars['String']['output'];
    profileImage?: Maybe<Scalars['String']['output']>;
    trial: Scalars['Boolean']['output'];
    updatedAt: Scalars['DateTime']['output'];
};

export type UserAnsweredQuestion = {
    __typename?: 'UserAnsweredQuestion';
    answer?: Maybe<Answer>;
    created_at: Scalars['DateTime']['output'];
    data?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    question?: Maybe<Question>;
    question_id: Scalars['ID']['output'];
    updated_at: Scalars['DateTime']['output'];
    user?: Maybe<User>;
};

export type UserAnsweredQuestionInput = {
    answerId?: InputMaybe<Scalars['String']['input']>;
    data?: InputMaybe<Scalars['String']['input']>;
    questionId: Scalars['String']['input'];
};

export type UserWithAdditionalInfo = {
    __typename?: 'UserWithAdditionalInfo';
    age: Scalars['Float']['output'];
    cardInfo: CardInfo;
    countryId?: Maybe<Scalars['Float']['output']>;
    createdAt: Scalars['DateTime']['output'];
    firstname: Scalars['String']['output'];
    genderId?: Maybe<Scalars['Float']['output']>;
    id: Scalars['ID']['output'];
    isFavourite: Scalars['Boolean']['output'];
    isLockedCommunication: Scalars['Boolean']['output'];
    lastname: Scalars['String']['output'];
    profileImage?: Maybe<Scalars['String']['output']>;
    updatedAt: Scalars['DateTime']['output'];
};

export type UserWithToken = {
    __typename?: 'UserWithToken';
    accessToken: Scalars['String']['output'];
    user: User;
};

/** sent verification code status code enumeration */
export enum VerificationCodeStatusCode {
    Invalid = 'INVALID',
    NotFound = 'NOT_FOUND',
    Valid = 'VALID',
}
