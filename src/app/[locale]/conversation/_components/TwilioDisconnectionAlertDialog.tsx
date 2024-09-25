'use client'

import { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
} from '@/src/components/ui/alert-dialog'
import { Button } from '@/src/components/ui/button'
import { useTranslation } from 'react-i18next'

type Props = {
    open: boolean
}

export const TwilioDisconnectionAlertDialog = ({ open }: Props) => {
    const [openAlert, setOpenAlert] = useState<boolean>()
    const { t } = useTranslation('conversation')

    const handleRefresh = () => {
        location.reload()
    }

    useEffect(() => {
        setOpenAlert(open)
    }, [open])

    return (
        <AlertDialog open={openAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogDescription className="text-center">
                        {t('twilioError')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        onClick={() => setOpenAlert(false)}
                        className="mt-4 w-auto text-xs sm:mt-0 md:text-sm lg:w-auto lg:text-sm "
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        className="w-auto text-xs  md:text-sm lg:text-sm "
                        onClick={handleRefresh}
                    >
                        {t('refresh')}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
