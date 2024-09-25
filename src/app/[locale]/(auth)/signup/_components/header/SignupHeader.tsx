import { useTranslation } from 'react-i18next'
import style from './style.module.css'

type SignupHeaderProps = {
    step: number
}

export default function SignupHeader({ step }: SignupHeaderProps) {
    const { t } = useTranslation()

    return (
        <div className="flex w-full flex-col bg-[##F2F5FF] pb-4 pt-8">
            <div className="flex w-full flex-row">
                <div
                    className={`${style.arrow} ${style.arrowStart} ${step > 1 ? `${style.arrowactive1}` : ''} ${step >= 1 ? `${style.arrowactive}` : ''} z-50 flex items-center justify-center rounded-l-xl bg-mainGreen text-[#FFFFFF] `}
                >
                    1 {t('step')}
                </div>
                <div
                    className={`${style.arrow} ${step > 2 ? `${style.arrowactive1} text-[#FFFFFF]` : ''} ${step >= 2 ? `${style.arrowactive} text-[#FFFFFF]` : ''} z-40 flex items-center justify-center`}
                >
                    2 {t('step')}
                </div>
                <div
                    className={`${style.arrow} ${step > 3 ? `${style.arrowactive1} text-[#FFFFFF]` : ''} ${step >= 3 ? `${style.arrowactive} text-[#FFFFFF]` : ''} z-30 flex items-center justify-center`}
                >
                    3 {t('step')}
                </div>
            </div>
        </div>
    )
}
