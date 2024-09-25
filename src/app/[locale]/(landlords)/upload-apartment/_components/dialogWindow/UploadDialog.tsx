'use client'

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/src/components/ui/alert-dialog'
import { Button } from '@/src/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Error, Success } from '../../../../../../components/svgs'
import { useRouter } from 'next/navigation'

export function UploadDialog({ setOpenAlert, openAlert, alertMessage }: any) {
    const { t } = useTranslation()
    const router = useRouter()

    const handleClose = () => {
        setOpenAlert(false)
        if (alertMessage === 'success' && typeof location !== 'undefined') {
            router.push('/landlord-profile')
        }
    }

    return (
        <AlertDialog open={openAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex justify-center">
                        {alertMessage === 'success' ? (
                            <Success className="h-12 w-12 md:h-24 md:w-24" />
                        ) : (
                            <Error className="h-12 w-12 md:h-24 md:w-24" />
                        )}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        {t(`${alertMessage}`)}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button className="w-auto text-xs md:text-sm lg:text-sm" onClick={handleClose}>
                        {t('close')}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
