export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  PhoneNumber: { input: any; output: any; }
  /** A tuple of two strings */
  StringTuple: { input: any; output: any; }
};

export type AnswerObject = {
  __typename?: 'AnswerObject';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  question: QuestionObject;
  questionId: Scalars['ID']['output'];
  translations: Array<AnswerTranslatedObject>;
  updatedAt: Scalars['DateTime']['output'];
  visible: Scalars['Boolean']['output'];
};

export type AnswerTranslatedObject = {
  __typename?: 'AnswerTranslatedObject';
  answerId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lang: Language;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AnsweredQuestionInput = {
  answerIds?: InputMaybe<Array<Scalars['String']['input']>>;
  data?: InputMaybe<Scalars['String']['input']>;
  dataRange?: InputMaybe<Scalars['StringTuple']['input']>;
  questionId: Scalars['String']['input'];
};

export type CardInfoObject = {
  __typename?: 'CardInfoObject';
  bio: Scalars['String']['output'];
  budget: Scalars['Int']['output'];
  districtNames: Scalars['String']['output'];
};

export type CheckSmsCodeInput = {
  code: Scalars['Int']['input'];
  phone: Scalars['String']['input'];
};

/** Conversation status enumeration */
export enum ConversationStatus {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Requested = 'requested'
}

export type ConversationWithUserObject = {
  __typename?: 'ConversationWithUserObject';
  createdAt: Scalars['DateTime']['output'];
  creatorId: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  sid: Scalars['String']['output'];
  status: ConversationStatus;
  unreadMessagesCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<UserPreviewObject>;
};

export type CountryObject = {
  __typename?: 'CountryObject';
  alpha2Code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  translations?: Maybe<Array<CountryTranslatedObject>>;
  visible: Scalars['Boolean']['output'];
};

export type CountryTranslatedObject = {
  __typename?: 'CountryTranslatedObject';
  countryId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lang: Language;
  name: Scalars['String']['output'];
};

export type DistrictObject = {
  __typename?: 'DistrictObject';
  id: Scalars['ID']['output'];
  translations?: Maybe<Array<DistrictTranslatedObject>>;
  visible: Scalars['Boolean']['output'];
};

export type DistrictTranslatedObject = {
  __typename?: 'DistrictTranslatedObject';
  id: Scalars['ID']['output'];
  lang: Language;
  name: Scalars['String']['output'];
};

export type FilterInput = {
  answerIds?: InputMaybe<Array<Scalars['String']['input']>>;
  columnName?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['String']['input']>;
  dataRange?: InputMaybe<Scalars['StringTuple']['input']>;
  questionId?: InputMaybe<Scalars['String']['input']>;
};

export type FilterWithPaginationObject = {
  __typename?: 'FilterWithPaginationObject';
  list?: Maybe<Array<UserWithAdditionalInfoObject>>;
  pageInfo: PaginationInfoObject;
};

export type GenderObject = {
  __typename?: 'GenderObject';
  id: Scalars['ID']['output'];
  translations: Array<GenderTranslatedObject>;
  visible: Scalars['Boolean']['output'];
};

export type GenderTranslatedObject = {
  __typename?: 'GenderTranslatedObject';
  id: Scalars['ID']['output'];
  lang: Language;
  sex: Scalars['String']['output'];
};

/** Language enumeration */
export enum Language {
  En = 'en',
  Ka = 'ka'
}

export type Mutation = {
  __typename?: 'Mutation';
  checkCode: VerificationCodeStatusCode;
  generateTwilioAccessToken: Scalars['String']['output'];
  logConnectionError: Scalars['Boolean']['output'];
  lookupOrCreateTwilioUserResource: Scalars['Boolean']['output'];
  sendCode: SmsStatusCode;
  signUp: UserWithTokenObject;
  updateConversationStatus: ConversationStatus;
};


export type MutationCheckCodeArgs = {
  input: CheckSmsCodeInput;
};


export type MutationLogConnectionErrorArgs = {
  error: Scalars['String']['input'];
};


export type MutationLookupOrCreateTwilioUserResourceArgs = {
  userId: Scalars['String']['input'];
};


export type MutationSendCodeArgs = {
  input: SendSmsCodeInput;
};


export type MutationSignUpArgs = {
  userAndAnsweredQuestions: UserAndAnsweredQuestionsInput;
};


export type MutationUpdateConversationStatusArgs = {
  conversationId: Scalars['String']['input'];
  status: ConversationStatus;
};

export type PaginatedConversationWithUserObject = {
  __typename?: 'PaginatedConversationWithUserObject';
  list?: Maybe<Array<ConversationWithUserObject>>;
  pageInfo: PaginationInfoObject;
};

export type PaginationInfoObject = {
  __typename?: 'PaginationInfoObject';
  hasNextPage: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginationInput = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  getConversationsForUser?: Maybe<PaginatedConversationWithUserObject>;
  getCountries?: Maybe<Array<CountryObject>>;
  getCountry?: Maybe<CountryObject>;
  getDistrict?: Maybe<DistrictObject>;
  getDistricts?: Maybe<Array<DistrictObject>>;
  getFilteredUsers?: Maybe<FilterWithPaginationObject>;
  getGender?: Maybe<GenderObject>;
  getGenders?: Maybe<Array<GenderObject>>;
  getQuestionsWithAnswers?: Maybe<Array<QuestionObject>>;
  getSharedConversation?: Maybe<ConversationWithUserObject>;
  getUniversities?: Maybe<Array<UniversityObject>>;
  getUniversity?: Maybe<UniversityObject>;
};


export type QueryGetConversationsForUserArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryGetCountriesArgs = {
  locale?: InputMaybe<Language>;
};


export type QueryGetCountryArgs = {
  id: Scalars['Int']['input'];
  locale?: InputMaybe<Language>;
};


export type QueryGetDistrictArgs = {
  id: Scalars['Int']['input'];
  locale?: InputMaybe<Language>;
};


export type QueryGetDistrictsArgs = {
  locale?: InputMaybe<Language>;
};


export type QueryGetFilteredUsersArgs = {
  filters?: InputMaybe<Array<FilterInput>>;
  locale?: InputMaybe<Language>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryGetGenderArgs = {
  id: Scalars['Int']['input'];
  locale?: InputMaybe<Language>;
};


export type QueryGetGendersArgs = {
  locale?: InputMaybe<Language>;
};


export type QueryGetQuestionsWithAnswersArgs = {
  getFor?: InputMaybe<QuestionsWithAnswersFor>;
  lang?: InputMaybe<Language>;
};


export type QueryGetSharedConversationArgs = {
  targetUserId: Scalars['String']['input'];
};


export type QueryGetUniversitiesArgs = {
  locale?: InputMaybe<Language>;
};


export type QueryGetUniversityArgs = {
  id: Scalars['Int']['input'];
  locale?: InputMaybe<Language>;
};

export type QuestionObject = {
  __typename?: 'QuestionObject';
  answers?: Maybe<Array<AnswerObject>>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  translations?: Maybe<Array<QuestionTranslatedObject>>;
  uiFieldInfo: Scalars['JSON']['output'];
  updatedAt: Scalars['DateTime']['output'];
  visible: Scalars['Boolean']['output'];
};

export type QuestionTranslatedObject = {
  __typename?: 'QuestionTranslatedObject';
  createdAt: Scalars['DateTime']['output'];
  filterTitle?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lang: Language;
  questionId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Get questions with answers for enumeration */
export enum QuestionsWithAnswersFor {
  Filter = 'FILTER',
  Signup = 'SIGNUP'
}

export type SendSmsCodeInput = {
  phone: Scalars['String']['input'];
};

export type SignedUpUserObject = {
  __typename?: 'SignedUpUserObject';
  birthDate?: Maybe<Scalars['Date']['output']>;
  callingCode: Scalars['String']['output'];
  countryId?: Maybe<Scalars['ID']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstname: Scalars['String']['output'];
  genderId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

/** sms sending status code enumeration */
export enum SmsStatusCode {
  AlreadySent = 'ALREADY_SENT',
  Failed = 'FAILED',
  Success = 'SUCCESS'
}

export type UniversityObject = {
  __typename?: 'UniversityObject';
  id: Scalars['ID']['output'];
  translations?: Maybe<Array<UniversityTranslatedObject>>;
  visible: Scalars['Boolean']['output'];
};

export type UniversityTranslatedObject = {
  __typename?: 'UniversityTranslatedObject';
  id: Scalars['ID']['output'];
  lang: Language;
  name: Scalars['String']['output'];
};

export type UserAndAnsweredQuestionsInput = {
  answeredQuestions: Array<AnsweredQuestionInput>;
  birthDate: Scalars['Date']['input'];
  confirmPassword: Scalars['String']['input'];
  countryId: Scalars['Int']['input'];
  email?: InputMaybe<Scalars['EmailAddress']['input']>;
  firstname: Scalars['String']['input'];
  genderId: Scalars['Int']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['PhoneNumber']['input'];
};

export type UserAnsweredQuestionObject = {
  __typename?: 'UserAnsweredQuestionObject';
  answer?: Maybe<AnswerObject>;
  answerId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateRangeData?: Maybe<Array<Scalars['DateTime']['output']>>;
  id: Scalars['ID']['output'];
  intData?: Maybe<Scalars['Int']['output']>;
  question?: Maybe<QuestionObject>;
  questionId: Scalars['ID']['output'];
  textData?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<UserObject>;
  userId: Scalars['ID']['output'];
};

export type UserObject = {
  __typename?: 'UserObject';
  age?: Maybe<Scalars['Int']['output']>;
  answeredQuestions?: Maybe<Array<UserAnsweredQuestionObject>>;
  available: Scalars['Boolean']['output'];
  birthDate?: Maybe<Scalars['Date']['output']>;
  callingCode: Scalars['String']['output'];
  country?: Maybe<CountryObject>;
  countryId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  firstname: Scalars['String']['output'];
  gender: GenderObject;
  genderId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  isLockedCommunication: Scalars['Boolean']['output'];
  lastname: Scalars['String']['output'];
  password: Scalars['String']['output'];
  payed: Scalars['Boolean']['output'];
  payedUntil?: Maybe<Scalars['DateTime']['output']>;
  phone: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
  trial: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UserPreviewObject = {
  __typename?: 'UserPreviewObject';
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
};

export type UserWithAdditionalInfoObject = {
  __typename?: 'UserWithAdditionalInfoObject';
  age?: Maybe<Scalars['Int']['output']>;
  cardInfo: CardInfoObject;
  createdAt: Scalars['DateTime']['output'];
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isFavourite: Scalars['Boolean']['output'];
  lastname: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UserWithTokenObject = {
  __typename?: 'UserWithTokenObject';
  accessToken: Scalars['String']['output'];
  user: SignedUpUserObject;
};

/** sent verification code status code enumeration */
export enum VerificationCodeStatusCode {
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Valid = 'VALID'
}
