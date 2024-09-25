/* eslint-disable @typescript-eslint/no-explicit-any */
import PhoneInputWithCountrySelect from 'react-phone-number-input'

export default function PhoneInput({ field, labels, form }: any) {
    return (
        <PhoneInputWithCountrySelect
            labels={labels}
            defaultCountry="GE"
            international
            value={field?.value}
            onChange={(phone) => {
                form?.setValue('phone', phone)
            }}
        />
    )
}
