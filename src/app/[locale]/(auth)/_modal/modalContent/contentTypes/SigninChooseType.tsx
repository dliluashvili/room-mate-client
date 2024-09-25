import { Button } from '@/src/components/ui/button'
import { useTranslation } from 'react-i18next'

type SigninChooseTypeProps = {
    signinRoommatesHandler: () => void
    signinLandlordsHandler: () => void
}

export default function SigninChooseType({
    signinRoommatesHandler,
    signinLandlordsHandler,
}: SigninChooseTypeProps) {
    const { t } = useTranslation()
    return (
        <div className="flex h-full  w-full flex-col items-center justify-center gap-6">
            <h1 className="text-center text-lg">{t('signinChoose')}</h1>
            <Button variant="modalButton" className="h-10 w-full" onClick={signinRoommatesHandler}>
                {t('signinAsRoommates')}
            </Button>
            <div className="h-[1px] w-full bg-slate-300"></div>
            <Button variant="modalButton" className="h-10 w-full" onClick={signinLandlordsHandler}>
                {t('signinAsLandlords')}
            </Button>
        </div>
    )
}
