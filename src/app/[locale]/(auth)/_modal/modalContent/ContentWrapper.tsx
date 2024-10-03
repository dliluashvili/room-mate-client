'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useModalHandlers } from '../modalHandlers/ModalHandlers'
import ModalImage from '@images/ModalImage.webp'
import Image from 'next/image'
import SigninChooseType from './contentTypes/SigninChooseType'
import SignupChooseType from './contentTypes/SignupChooseType'
import SignupLandlords from './contentTypes/SignupLandlords'
import SigninRoommates from './contentTypes/SigninRoommates'
import SigninLandlords from './contentTypes/SigninLandlords'
import ResetPassword from './contentTypes/ResetPassword'

export const ContentWrapper = () => {
    const [modalType, setModalType] = useState('')
    const searchParams = useSearchParams()

    useEffect(() => {
        const modal = searchParams.get('modal')
        if (modal === 'signinRoommates') {
            setModalType('signinRoommates')
        } else if (modal === 'signinLandlords') {
            setModalType('signinLandlords')
        } else if (modal === 'signupLandlords') {
            setModalType('signupLandlords')
        } else if (modal === 'resetPasswordRoommates') {
            setModalType('resetPasswordRoommates')
        } else if (modal === 'resetPasswordLandlords') {
            setModalType('resetPasswordLandlords')
        }
    }, [searchParams])

    const {
        signinRoommatesHandler,
        signinLandlordsHandler,
        signupRoommatesHandler,
        signupLandlordsHandler,
        signupChoosTypeHandler,
        signinChoosTypeHandler,
        landlordsResetPasswordHandler,
        roommatesResetPasswordHandler,
    } = useModalHandlers()

    return (
        <>
            <div className="flex h-full w-full  flex-col items-center  gap-4 gap-y-4    overflow-y-auto border-none p-6 md:w-[460px] md:p-12">
                {modalType === 'signupLandlords' ? (
                    <SignupLandlords signupChoosTypeHandler={signupChoosTypeHandler} />
                ) : modalType === 'signinRoommates' ? (
                    <SigninRoommates
                        roommatesResetPasswordHandler={roommatesResetPasswordHandler}
                        signinChoosTypeHandler={signinChoosTypeHandler}
                    />
                ) : modalType === 'signinLandlords' ? (
                    <SigninLandlords
                        signinChoosTypeHandler={signinChoosTypeHandler}
                        landlordsResetPasswordHandler={landlordsResetPasswordHandler}
                    />
                ) : modalType === 'resetPasswordRoommates' ||
                  modalType === 'resetPasswordLandlords' ? (
                    <ResetPassword
                        modalType={modalType}
                        signinLandlordsHandler={signinLandlordsHandler}
                        signinRoommatesHandler={signinRoommatesHandler}
                    />
                ) : null}
            </div>
            <div className="hidden h-full w-full overflow-hidden md:block md:w-[460px]">
                <Image src={ModalImage} alt="Temporray" className="h-full w-full object-cover" />
            </div>
        </>
    )
}
