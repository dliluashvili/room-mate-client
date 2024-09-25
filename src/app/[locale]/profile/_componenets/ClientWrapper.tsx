'use client'
import ProfileNavBar from './profileNavBar/ProfileNavBar'
import { withAuth } from '@/src/auth/withAuth'
import Verification from './verification/Verification'
import { useSearchParams } from 'next/navigation'

function ClientWrapper() {
    const searchParams = useSearchParams()

    const verification = searchParams.get('verification')

    return (
        <main className="mt-1 flex min-h-screen w-full flex-col  items-center overflow-scroll bg-[#F5F5F5] px-6 pb-8 pt-6 md:flex-row md:items-start  md:px-24">
            <div className="block  md:hidden">
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
