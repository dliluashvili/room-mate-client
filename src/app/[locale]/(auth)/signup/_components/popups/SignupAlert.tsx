import { Error } from '@/src/components/svgs'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/src/components/ui/alert-dialog'
import { Button } from '@/src/components/ui/button'
import { FACEBOOK_URL } from '@/src/constants/links'
import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

type SignupProps = {
    alertIsOpen: boolean
    alertType: string
    setAlertIsOpen: Dispatch<SetStateAction<boolean>>
}

export function SignupAlert({ alertIsOpen, alertType, setAlertIsOpen }: SignupProps) {
    const { t } = useTranslation()
    const handleClose = () => {
        setAlertIsOpen(false)
    }
    const handleClickOutside = (event: { stopPropagation: () => void }) => {
        event.stopPropagation()
    }

    function getAlertMessage() {
        switch (alertType) {
            case 'PHONE_EXISTS':
                return { text: t('phoneExist') }
            case 'EMAIL_EXISTS':
                return { text: t('emailExist') }
            case 'ERROR':
                return { text: t('serverError') }
            default:
                return { text: null }
        }
    }

    const alertMessage = getAlertMessage()

    return (
        <AlertDialog open={alertIsOpen}>
            <div onClick={handleClose}>
                <AlertDialogContent onClick={handleClickOutside}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex justify-center text-7xl">
                            <Error />
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            {alertMessage.text}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            className="w-auto text-xs md:text-sm lg:text-sm "
                            onClick={handleClose}
                        >
                            {t('close')}
                        </Button>
                        {alertType && alertType === 'ERROR' && (
                            <Button
                                className="w-auto text-xs md:text-sm lg:text-sm"
                                onClick={handleClose}
                            >
                                <Link href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                                    {t('supportTeam')}
                                </Link>
                            </Button>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </div>
        </AlertDialog>
    )
}
