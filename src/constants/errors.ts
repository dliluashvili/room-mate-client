const exceptionCodes = {
    unauthenticated: 'UNAUTHENTICATED',
}

const objectNames = {
    user: 'USER',
}

const fieldNames = {
    firstname: 'FIRSTNAME',
    lastName: 'LASTNAME',
    password: 'PASSWORD',
    confirmPassword: 'CONFIRM_PASSWORD',
    token: 'TOKEN',
    phone: 'PHONE',
    birthDate: 'BIRTH_DATE',
    email: 'EMAIL',
    identifier: 'IDENTIFIER',
    phoneOrEmail: 'PHONE_OR_EMAIL',
}

const errorNames = {
    incorrectPattern: 'INCORRECT_PATTERN',
    invalid: 'INVALID',
    notEqual: 'NOT_EQUAL',
    incorrect: 'INCORRECT',
    notFound: 'NOT_FOUND',
    throttle: 'THROTTLE',
    min: 'MIN',
    max: 'MAX',
    exists: 'EXISTS',
    existsWithEmail: 'EXISTS_WITH_EMAIL',
    existsWithPhone: 'EXISTS_WITH_PHONE',
    isEmpty: 'IS_EMPTY',
    required: 'REQUIRED',
}

const refreshToken = {
    token: {
        invalid: `${fieldNames.token}__${errorNames.invalid}`,
    },
}

const errorCodes = {
    refreshToken,
}

export { exceptionCodes, errorCodes }
