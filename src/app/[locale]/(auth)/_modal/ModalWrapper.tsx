'use client'

import { Dialog, DialogContent } from '@/src/components/ui/dialog'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useModalHandlers } from './modalHandlers/ModalHandlers'
import { Drawer, DrawerContent } from '@/src/components/ui/drawer'
import { useMediaQuery } from 'react-responsive'
import { ContentWrapper } from './modalContent/ContentWrapper'
import { X } from 'lucide-react'

export const ModalWrapper = () => {
    const [modalStatus, setModalStatus] = useState(false)
    const searchParams = useSearchParams()

    const isMobile = useMediaQuery({
        query: ' (max-width: 768px)',
    })

    const { modalCloseHandler } = useModalHandlers()

    useEffect(() => {
        const modal = searchParams.get('modal')
        if (modal) {
            setModalStatus(true)
        } else {
            setModalStatus(false)
        }
    }, [searchParams])

    return (
        <>
            {isMobile ? (
                <Dialog open={modalStatus}>
                    <DialogContent className=" fixed flex h-full w-full max-w-full flex-col gap-0 overflow-hidden border-none bg-[#FFFFFF] p-0 md:w-auto md:max-w-full md:flex-row">
                        <div className="flex w-full justify-end p-3">
                            <X onClick={modalCloseHandler} />
                        </div>
                        <ContentWrapper />
                    </DialogContent>
                </Dialog>
            ) : (
                <Dialog open={modalStatus} onOpenChange={modalCloseHandler}>
                    <DialogContent className="flex h-[600px] w-full max-w-full flex-col gap-0 overflow-hidden border-none bg-[#FFFFFF] p-0 md:w-auto md:max-w-full md:flex-row">
                        <ContentWrapper />
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
