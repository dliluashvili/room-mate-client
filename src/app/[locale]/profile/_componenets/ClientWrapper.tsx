'use client'

import ProfileNavBar from './profileNavBar/ProfileNavBar'
import { withAuth } from '@/src/auth/withAuth'
import Verification from './verification/Verification'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft } from '@/src/components/svgs'
import { useTranslation } from 'react-i18next'

function ClientWrapper() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { t } = useTranslation()

    const verification = searchParams.get('verification')

    const handleRouterBack = () => {
        router.back()
    }

    return (
        <main className="mt-1 flex min-h-screen w-full flex-col items-center overflow-scroll bg-[#F5F5F5] px-6 pb-8 pt-6 md:flex-row md:items-start md:px-24">
            <div className="mb-2 flex w-full justify-start md:hidden">
                <button
                    onClick={handleRouterBack}
                    className="flex w-auto items-center gap-1 text-xs"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    {t('routerBack')}
                </button>
            </div>
            <div className="block w-full md:hidden">
                {verification === 'true' ? <Verification /> : <ProfileNavBar />}
            </div>
            <div className="hidden flex-row md:flex md:gap-10">
                <ProfileNavBar />
                <Verification />
            </div>
        </main>
    )
}

export default withAuth(ClientWrapper)
