'use client'

import React, { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
    PaginatedFilteredPropertiesObject,
    PaginatedFilteredRoommatesObject,
} from '@/graphql/typesGraphql'
import { ArrowRight } from '@/src/components/svgs'

type DataProps = {
    data: PaginatedFilteredRoommatesObject | PaginatedFilteredPropertiesObject
}

export default function Pagination({ data }: DataProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const totalItems = data?.pageInfo.total
    const itemsPerPage = data?.pageInfo.limit
    const pageCount = Math.ceil(totalItems / itemsPerPage)

    const [currentPage, setCurrentPage] = useState(() => {
        const page = searchParams.get('page')
        return page ? parseInt(page, 10) - 1 : 0
    })

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )

    const handlePageChange = ({ selected }: { selected: number }) => {
        const nextPage = selected + 1
        setCurrentPage(selected)
        router.push(pathname + '?' + createQueryString('page', String(nextPage)))
    }

    useEffect(() => {
        const page = searchParams.get('page')
        if (page) {
            setCurrentPage(parseInt(page, 10) - 1)
        }
    }, [searchParams])

    return (
        <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            previousLabel={
                <div className="flex h-full items-center rounded-full p-1 text-sm hover:bg-slate-200">
                    <ArrowRight className="h-4 w-4 rotate-180 rounded-full  sm:h-5 sm:w-5" />
                </div>
            }
            nextLabel={
                <div className="flex h-full items-center rounded-full p-1 text-sm hover:bg-slate-200">
                    <ArrowRight className="h-4 w-4  sm:h-5 sm:w-5" />
                </div>
            }
            onPageChange={handlePageChange}
            forcePage={currentPage}
            previousClassName="text-sm"
            containerClassName="flex flex-row gap-2 w-full justify-center items-center"
            pageClassName="h-full flex items-centerjustify-center border border-slate-400  hover:bg-slate-200 rounded-sm cursor-pointer  "
            activeClassName="bg-slate-300  "
            pageLinkClassName=" h-7 w-7 lg:w-7 lg:h-6 flex items-center justify-center text-[##484848]"
        />
    )
}
