'use client'
import { getProperiesList } from '@/graphql/query'
import {
    GetPropertiesFilterInput,
    Language,
    PaginatedFilteredPropertiesObject,
} from '@/graphql/typesGraphql'
import Pagination from '@/src/components/shared/pagination/Pagination'
import {
    ActiveStatus,
    Door,
    FilterIcon,
    InactiveStatus,
    Square,
    Wallet,
} from '@/src/components/svgs'
import { useMutation, useQuery } from '@apollo/client'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Filter from './Filter'
import { useLockBodyScroll } from '@/src/components/hooks/useLockBodyScroll'
import Link from 'next/link'
import { getFingerprint } from '@/src/utils/fingerPrint'
import { UpdatePropertyOpenCount } from '@/graphql/mutation'

export default function ClientWrapper() {
    const { t } = useTranslation()
    const params = useParams()
    const locale = params.locale as Language
    const searchParams = useSearchParams()
    const page = searchParams.get('page') || '1'
    const currentPage = parseInt(page, 10)
    const limit = 10
    const offset = (currentPage - 1) * limit
    const [isOpen, setIsOpen] = useState(false)
    const [filterInputParams, setFilterInputParams] = useState<GetPropertiesFilterInput>()
    const [fingerprint, setFingerprint] = useState('')
    const [canSendMutation, setCanSendMutation] = useState(true)

    useLockBodyScroll(isOpen)

    const [updatePropertyClickCount] = useMutation(UpdatePropertyOpenCount)

    const { data, error } = useQuery(getProperiesList, {
        variables: {
            pagination: {
                limit,
                offset,
            },
            lang: locale,
            filters: filterInputParams,
        },
    })

    if (error) {
        return null
    }

    const handleApartmentClick = async (propertyId: string) => {
        if (fingerprint && canSendMutation) {
            const { data } = await updatePropertyClickCount({
                variables: {
                    propertyId,
                    fingerprint,
                },
            })
            if (data?.updatePropertyOpenCount) {
                setCanSendMutation(false)
                setTimeout(() => {
                    setCanSendMutation(true)
                }, 5000)
            }
        }
    }

    useEffect(() => {
        getFingerprint().then(setFingerprint)
    }, [])

    const paginatedData = data?.getProperties as PaginatedFilteredPropertiesObject

    return (
        <main className="flex min-h-screen w-full flex-col items-center gap-10 bg-[#F5F5F5]  px-6 pb-10 md:items-start md:px-20 md:py-10 lg:flex-row">
            <div className="flex h-auto w-full justify-start   pt-6   md:pt-10    lg:hidden lg:px-0">
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
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    setFilterInputParams={setFilterInputParams}
                />
            </div>
            {isOpen ? (
                <Filter
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    setFilterInputParams={setFilterInputParams}
                />
            ) : null}
            <div className="hidden min-h-screen w-[1px] bg-gray-200 lg:block"></div>
            <div className="grid  w-full  flex-col items-center  gap-10 md:w-auto md:grid-cols-2">
                {data?.getProperties?.list?.map((item, index) => (
                    <div className="flex w-full flex-col gap-4 md:w-[320px]">
                        <Link href={`/apartments/${item.id}`}>
                            <div
                                onClick={() => handleApartmentClick(item.id)}
                                key={index}
                                className="flex w-full flex-col overflow-hidden rounded-md bg-[#FFFFFF] shadow-md"
                            >
                                <Image
                                    width={320}
                                    height={180}
                                    alt="propert image"
                                    className="h-[200px] w-full object-cover"
                                    src={item.images && item.images[0].thumb}
                                />
                                <div className="flex w-full flex-col gap-4 px-4  py-6">
                                    <div className="flex w-full justify-between">
                                        <h1 className="text-base font-bold">
                                            <span>{item?.price} $</span>
                                        </h1>
                                        {true ? (
                                            <div className="flex items-center gap-1 rounded-md bg-[#CFF1E6] px-2 py-1">
                                                <span className="text-xs ">{t('active')}</span>
                                                <ActiveStatus className="h-4 w-4 fill-mainGreen" />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 rounded-md bg-[#FFDEDE] px-2 py-1">
                                                <span className="text-xs text-[red] ">
                                                    {t('expired')}
                                                </span>
                                                <InactiveStatus className="h-3 w-3 fill-[red]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex w-full justify-between">
                                        <div className="flex w-full flex-row items-center gap-1">
                                            <Door className="h-4 w-4 md:h-6 md:w-6" />
                                            <span>{t('bedrooms')}: </span>
                                            {item.bedrooms}
                                        </div>
                                        <div
                                            className="flex w-full flex-row  items-center gap-1
                                    "
                                        >
                                            <Square className="h-4 w-4 md:h-6 md:w-6" />
                                            <span>{t('area')}: </span>
                                            {item.area}
                                        </div>
                                    </div>
                                    <div
                                        className="flex w-full flex-col
                                "
                                    >
                                        {/* <div className="flex w-full flex-row items-center justify-start gap-1">
                                            <Location className="h-4 w-4 md:h-6 md:w-6" />
                                            <span className="line-clamp-1 text-ellipsis">
                                                {item.street}
                                            </span>
                                        </div> */}
                                        <div className="hidden  w-1/2 flex-row items-center justify-start gap-1 md:hidden">
                                            <Wallet className="h-4 w-4 md:h-6 md:w-6" />
                                            <span>{t('price')}: </span>
                                            {item.price}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
                <Pagination data={paginatedData} />
            </div>
        </main>
    )
}
