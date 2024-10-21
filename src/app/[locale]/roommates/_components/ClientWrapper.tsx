'use client'
import { useEffect, useState } from 'react'
import Filter from './filter/Filter'
import UserList from './userList/UserList'
import { FilterIcon } from '@/src/components/svgs'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'
import { FilterInput } from '@/graphql/typesGraphql'
import { useLockBodyScroll } from '@/src/components/hooks/useLockBodyScroll'
import { withAuth } from '@/src/auth/withAuth'

function ClientWrapper() {
    const [isOpen, setIsOpen] = useState(false)
    const [transformedParams, setTransformedParams] = useState<FilterInput[]>([])
    const searchParams = useSearchParams()

    const { t } = useTranslation()
    useLockBodyScroll(isOpen)
    useEffect(() => {
        const transformedParams: FilterInput[] = []
        for (let i = 0; ; i++) {
            const questionId = searchParams.get(`range[${i}][questionId]`)
            const questionName = searchParams.get(`range[${i}][questionName]`)
            const dataRange = searchParams.get(`range[${i}][dataRange]`)?.split(',')

            if (!questionId || !questionName || !dataRange) break

            transformedParams.push({
                questionId,
                questionName,
                dataRange,
            })
        }

        for (let i = 0; ; i++) {
            const questionId = searchParams.get(`answer[${i}][questionId]`)
            const questionName = searchParams.get(`answer[${i}][questionName]`)
            const answerIds = searchParams.get(`answer[${i}][answerIds]`)?.split(',')

            if (!questionId || !questionName || !answerIds) break

            transformedParams.push({
                questionId,
                questionName,
                answerIds,
            })
        }
        for (let i = 0; ; i++) {
            const columnName = searchParams.get(`answer[${i}][columnName]`)
            const data = searchParams.get(`answer[${i}][data]`)

            if (!columnName || !data) break

            transformedParams.push({
                columnName,
                data,
            })
        }

        setTransformedParams(transformedParams)
    }, [searchParams, isOpen])

    return (
        <>
            <main className="relative flex min-h-screen w-full  flex-col  lg:flex-row lg:gap-4 lg:px-20  lg:py-10 xl:px-24">
                <div className="flex h-auto w-full justify-start px-6 pt-6 sm:px-16 md:px-20 md:pt-10    lg:hidden lg:px-0">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex  flex-row items-center   rounded-lg border border-[#838CAC] bg-[#F2F5FF] px-4 py-2 "
                    >
                        <FilterIcon className="h-6 w-6" />
                        <span className="ml-2 text-sm text-[#838CAC]">{t('filter')}</span>
                    </button>
                </div>
                <div className="hidden h-full lg:block lg:w-1/2 xl:w-[30%] ">
                    <Filter
                        transformedParams={transformedParams}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                </div>

                {isOpen ? (
                    <Filter
                        transformedParams={transformedParams}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                ) : null}
                <div className="hidden h-screen w-[1px] bg-[#E3E3E3] xl:block"></div>
                <UserList transformedParams={transformedParams} />
            </main>
        </>
    )
}

export default withAuth(ClientWrapper)
