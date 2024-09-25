import { Button } from '@/src/components/ui/button'
import { useTranslation } from 'react-i18next'
type SignupChooseTypeProps = {
    signupLandlordsHandler: () => void
    signupRoommatesHandler: () => void
}

export default function SignupChooseType({
    signupLandlordsHandler,
    signupRoommatesHandler,
}: SignupChooseTypeProps) {
    const { t } = useTranslation()
    return (
        <div className="flex h-full w-full flex-col  items-center justify-center gap-6  ">
            <h1 className="text-center text-lg">{t('signupChoose')}</h1>
            <Button variant="modalButton" className="h-10 w-full" onClick={signupRoommatesHandler}>
                {t('asRoommate')}
            </Button>
            <div className="h-[1px] w-full bg-slate-300"></div>
            <Button variant="modalButton" className="h-10 w-full" onClick={signupLandlordsHandler}>
                {t('asLandlord')}
            </Button>
        </div>
    )
}
