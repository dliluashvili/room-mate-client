/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import * as React from 'react'
import { cn } from '@/src/utils/cn'
import { Success } from '../svgs'
import { Error } from '../svgs'
import { useTranslation } from 'react-i18next'
import { Button } from './button'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean
    isSuccess?: boolean
    getCode?: boolean
    getCodeButtonClicked?: boolean
    onGetCodeClick?: () => void
    setPhoneFormat?: any
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            hasError,
            isSuccess,
            setPhoneFormat,
            getCode,
            onGetCodeClick,
            getCodeButtonClicked,
            ...props
        },
        ref
    ) => {
        const { t } = useTranslation()

        return (
            <div className="relative flex w-full items-center">
                <input
                    autoComplete="off"
                    type={type}
                    className={cn(
                        'flex h-[38px] w-full rounded-lg  border border-[#828bab] bg-[#FFFFFF] px-3 py-2 text-base placeholder:text-placeholderColor focus:outline-[#3dae8c] focus:ring-0',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {hasError && (
                    <div className="absolute right-4 top-2">
                        <Error className="h-6 w-6" />
                    </div>
                )}
                {isSuccess && (
                    <div className="absolute right-4 top-2">
                        <Success className="h-6 w-6" />
                    </div>
                )}
                {getCode && (
                    <div className="absolute right-3">
                        <Button
                            type="button"
                            className="h-8 w-auto px-2 text-xs lg:text-sm "
                            onClick={() => {
                                if (onGetCodeClick) {
                                    onGetCodeClick()
                                }

                                if (setPhoneFormat) {
                                    setPhoneFormat(true)
                                }
                            }}
                        >
                            {getCodeButtonClicked ? t('resend') : t('getCode')}
                        </Button>
                    </div>
                )}
            </div>
        )
    }
)

export { Input }
