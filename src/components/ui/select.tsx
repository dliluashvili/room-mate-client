/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, ChevronDown } from 'lucide-react'
import ReactSelect, {
    DropdownIndicatorProps as ReactSelectDropdownIndicatorProps,
    ClearIndicatorProps as ReactSelectClearIndicatorProps,
    MultiValueRemoveProps as ReactSelectMultiValueRemoveProps,
    GroupBase,
    components,
    Props as ReactSelectProps,
    Theme,
} from 'react-select'
import { cn } from '@/src/utils/cn'
import { useState } from 'react'
import { useRootCssVar } from '@/src/hooks/useRootCssVar'
import { useTranslation } from 'react-i18next'

type DropdownIndicatorProps = ReactSelectDropdownIndicatorProps<
    unknown,
    boolean,
    GroupBase<unknown>
> & {
    isMenuOpen: boolean
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
    const { isMenuOpen, setIsMenuOpen, ...dropdownIndicatorProps } = props

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsMenuOpen(!isMenuOpen)
    }
    return (
        components.DropdownIndicator && (
            <components.DropdownIndicator {...dropdownIndicatorProps}>
                <ChevronDown
                    size={20}
                    className={cn('text-neutral-600', {
                        'rotate-180': isMenuOpen,
                    })}
                    onTouchStart={handleTouchStart}
                />
            </components.DropdownIndicator>
        )
    )
}

type ClearIndicatorProps = ReactSelectClearIndicatorProps<unknown, boolean, GroupBase<unknown>>

const ClearIndicator = (props: ClearIndicatorProps) => {
    return (
        components.ClearIndicator && (
            <components.ClearIndicator {...props}>
                <X size={20} />
            </components.ClearIndicator>
        )
    )
}

type MultiValueRemoveProps = ReactSelectMultiValueRemoveProps<unknown, boolean, GroupBase<unknown>>

const MultiValueRemove = (props: MultiValueRemoveProps) => {
    return (
        components.MultiValueRemove && (
            <components.MultiValueRemove {...props}>
                <X size={14} />
            </components.MultiValueRemove>
        )
    )
}

type SelectProps = ReactSelectProps & {
    showFocusBorder?: boolean
}

const Select = (props: SelectProps) => {
    const {
        isMulti,
        loadingMessage,
        noOptionsMessage,
        placeholder,
        showFocusBorder = false,
        ...restReactSelectProps
    } = props

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const mainGreenColor = useRootCssVar('--mainGreen')
    const mainGreen100Color = useRootCssVar('--mainGreen-100')
    const mainGreen300Color = useRootCssVar('--mainGreen-300')
    const mainGreen500Color = useRootCssVar('--mainGreen-500')

    const destructiveColor = useRootCssVar('--destructive')

    const placeholderColor = useRootCssVar('--placeholderColor')

    const { t } = useTranslation()

    const multiValueVerticalMargin = 2
    const multiValueHorizontalMargin = 3.5

    const customStyles = {
        container: (baseStyles: any) => ({
            ...baseStyles,
        }),
        // main container(wrapper)
        control: (baseStyles: any, state: { isFocused: boolean }) => {
            let shouldFocused = false

            if (showFocusBorder) {
                if (isMulti) {
                    shouldFocused = state.isFocused
                } else {
                    shouldFocused = isMenuOpen
                }
            }

            return {
                ...baseStyles,
                border: !shouldFocused ? '1px solid #828bab' : `1px solid hsl(${mainGreenColor})`,
                borderRadius: 8,
                cursor: 'pointer',
                minHeight: 38,
                boxShadow: shouldFocused ? `inset 0 0 0 1px hsl(${mainGreenColor})` : 'none',
                transition: 0,

                '&:hover': {},
            }
        },
        valueContainer: (baseStyles: any) => ({
            ...baseStyles,
            padding: '7.5px 12px',
            margin: isMulti ? `-${multiValueVerticalMargin}px -${multiValueHorizontalMargin}px` : 0,
        }),

        // input
        input: (baseStyles: any) => ({
            ...baseStyles,
            padding: 0,
            // because of gap, margin with minus value subtracts padding from valueContainer
            // need to add same margin value input compensate overall padding sizing
            // is only happens when "isMulti = false"
            margin: isMulti ? `0 0 0 ${multiValueHorizontalMargin}px` : 0,
        }),
        placeholder: (baseStyles: any) => ({
            ...baseStyles,
            // because of gap, margin with minus value subtracts padding from valueContainer
            // need to add same margin value input compensate overall padding sizing
            // is only happens when "isMulti = false"
            margin: isMulti ? `0 0 0 ${multiValueHorizontalMargin}px` : 0,
            color: `hsl(${placeholderColor})`,
        }),

        // single value
        singleValue: (baseStyles: any) => ({
            ...baseStyles,
            margin: 0,
        }),

        // multi values
        multiValue: (baseStyles: any) => ({
            ...baseStyles,
            margin: isMulti ? `${multiValueVerticalMargin}px ${multiValueHorizontalMargin}px` : 0,
        }),
        multiValueLabel: (baseStyles: any) => ({
            ...baseStyles,
            fontSize: 14,
            padding: 0,
            // react-select somehow sets "padding-left: 6px" even if "padding: 0".
            // so need override by hand
            paddingLeft: 3.5,
        }),
        multiValueRemove: (baseStyles: any) => ({
            ...baseStyles,
            padding: '1px 3.5px',
        }),

        // menu
        option: (baseStyles: any) => ({
            ...baseStyles,
            cursor: 'pointer',
        }),

        // indicator(close, dropdown)
        indicatorsContainer: (baseStyles: any) => ({
            ...baseStyles,
            padding: '8px 12px 8px 0',
        }),
        indicatorSeparator: (baseStyles: any) => ({
            ...baseStyles,
            display: 'none',
        }),
        clearIndicator: (baseStyles: any) => ({
            ...baseStyles,
            padding: 0,
            marginRight: 6,
        }),
        dropdownIndicator: (baseStyles: any) => ({
            ...baseStyles,
            padding: 0,
            width: 'auto',
            cursor: 'pointer',
        }),
        menu: (baseStyles: any) => ({
            ...baseStyles,
            borderRadius: 8,
            overflow: 'hidden',
        }),
        menuList: (baseStyles: any) => ({
            ...baseStyles,
            paddingTop: 0,
            paddingBottom: 0,
        }),
    }

    const customTheme = (props: Theme) => {
        return {
            ...props,
            colors: {
                ...props.colors,
                primary: `hsl(${mainGreenColor})`,
                primary75: `hsl(${mainGreen500Color})`,
                primary50: `hsl(${mainGreen300Color})`,
                primary25: `hsl(${mainGreen100Color})`,
                danger: `hsl(${destructiveColor})`,
            },
        }
    }

    const handleMenuOpen = () => {
        setIsMenuOpen(true)

        if (typeof restReactSelectProps.onMenuOpen === 'function') {
            restReactSelectProps.onMenuOpen()
        }
    }

    const handleMenuClose = () => {
        setIsMenuOpen(false)

        if (typeof restReactSelectProps.onMenuClose === 'function') {
            restReactSelectProps.onMenuClose()
        }
    }

    return (
        <ReactSelect
            {...restReactSelectProps}
            styles={customStyles}
            theme={customTheme}
            components={{
                ...restReactSelectProps.components,
                DropdownIndicator: (props) => (
                    <DropdownIndicator
                        {...props}
                        isMenuOpen={isMenuOpen}
                        setIsMenuOpen={setIsMenuOpen}
                    />
                ),
                ClearIndicator: (props) => <ClearIndicator {...props} />,
                MultiValueRemove: (props) => <MultiValueRemove {...props} />,
            }}
            isMulti={isMulti}
            onMenuOpen={handleMenuOpen}
            onMenuClose={handleMenuClose}
            loadingMessage={loadingMessage ?? (() => t('reactSelectLoadingMessage'))}
            noOptionsMessage={noOptionsMessage ?? (() => t('reactSelectNoOptionsMessage'))}
            placeholder={placeholder ?? t('reactSelectPlaceholder')}
        />
    )
}

export default Select
