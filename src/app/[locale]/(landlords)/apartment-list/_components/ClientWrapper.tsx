'use client'
import { RemoveProperty } from '@/graphql/mutation'
import { getLandlordProperties } from '@/graphql/query'
import { Language, PaginatedFilteredPropertiesObject } from '@/graphql/typesGraphql'
import { withAuth } from '@/src/auth/withAuth'
import Pagination from '@/src/components/shared/pagination/Pagination'
import {
    ActiveStatus,
    Door,
    Edit,
    InactiveStatus,
    Location,
    Square,
    Trash,
    Wallet,
} from '@/src/components/svgs'
import { useMutation, useQuery } from '@apollo/client'
import CoverImage from '@images/ApartmentCover.png'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

function ClientWrapper() {
    const { t } = useTranslation()
    const params = useParams()
    const locale = params.locale as Language
    const searchParams = useSearchParams()
    const page = searchParams.get('page') || '1'
    const currentPage = parseInt(page, 10)
    const limit = 10
    const offset = (currentPage - 1) * limit

    const { data, error } = useQuery(getLandlordProperties, {
        variables: {
            pagination: {
                limit,
                offset,
            },
            lang: locale,
        },
    })

    if (error) {
        console.error('Error fetching properties:', error)
        return <div>Error loading properties</div>
    }
    const [removeProperty] = useMutation(RemoveProperty)

    const deletePropertyHandler = async (id: string) => {
        try {
            const { data: removed, errors: removeErrors } = await removeProperty({
                variables: {
                    propertyId: id,
                    isSoftRemove: null,
                },
                // Refetch the query to get the updated list of properties after deletion
                refetchQueries: [
                    {
                        query: getLandlordProperties,
                        variables: { pagination: { limit, offset }, lang: locale },
                    },
                ],
            })

            if (removeErrors) {
                console.error('Error removing property:', removeErrors)
            } else {
                console.log('Property removed successfully:', removed)
            }
        } catch (err) {
            console.error('Error deleting property:', err)
        }
    }

    const paginatedData = data?.getLandlordProperties as PaginatedFilteredPropertiesObject

    return (
        <main className="flex min-h-screen w-full flex-col items-center gap-10 bg-[#F5F5F5] pb-10">
            <Image
                src={CoverImage}
                alt="cover image"
                className=" h-[150px] w-full object-cover object-center md:h-auto"
            />
            <h1 className="py-4 text-center  text-base font-semibold md:text-xl">
                {t('myListings')}
            </h1>
            {data?.getLandlordProperties?.list?.map((item, index) => (
                <div className="flex w-full flex-col gap-4  px-6 md:w-auto">
                    <div
                        key={index}
                        className="flex w-full flex-col overflow-hidden rounded-md bg-[#FFFFFF] shadow-md md:h-[180px] md:w-[800px]  md:flex-row"
                    >
                        <Image
                            width={320}
                            height={180}
                            alt="propert image"
                            className="h-[200px] w-full object-cover md:h-[180px] md:w-[320px]"
                            src={item.images && item.images[0].thumb}
                        />
                        <div className="flex w-full flex-col gap-4 px-4  py-6  md:gap-6">
                            <div className="flex w-full justify-between">
                                <h1 className="text-base font-bold">
                                    <span className="hidden md:block">
                                        {item?.translations && item?.translations[0]?.title}
                                    </span>
                                    <span className="block md:hidden">{item?.price} $</span>
                                </h1>
                                {true ? (
                                    <div className="flex items-center gap-1 rounded-md bg-[#CFF1E6] px-2 py-1">
                                        <span className="text-xs ">{t('active')}</span>
                                        <ActiveStatus className="h-4 w-4 fill-mainGreen" />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 rounded-md bg-[#FFDEDE] px-2 py-1">
                                        <span className="text-xs text-[red] ">{t('expired')}</span>
                                        <InactiveStatus className="h-3 w-3 fill-[red]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex w-full  md:flex-row md:items-center md:justify-between">
                                <div className="flex w-full  flex-row items-center gap-1 md:w-1/2">
                                    <Door className="h-4 w-4 md:h-6 md:w-6" />
                                    <span>{t('rooms')}: </span>
                                    {item.rooms}
                                </div>
                                <div className="flex w-full flex-row  items-center gap-1 md:w-1/2">
                                    <Square className="h-4 w-4 md:h-6 md:w-6" />
                                    <span>{t('area')}: </span>
                                    {item.area}
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between">
                                {/* <div className="flex w-1/2 flex-row items-center justify-start gap-1">
                                    <Location className="h-4 w-4 md:h-6 md:w-6" />
                                    <span className="line-clap-1 text-ellipsis">
                                        {t('address')}: {item.street}
                                    </span>
                                </div> */}
                                <div className="hidden  w-1/2 flex-row items-center justify-start gap-1 md:flex">
                                    <Wallet className="h-4 w-4 md:h-6 md:w-6" />{' '}
                                    <span>{t('price')}: </span>
                                    {item.price} $
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full justify-end">
                        <div className="flex gap-4 text-xs">
                            <button
                                onClick={() => {
                                    deletePropertyHandler(item.id)
                                }}
                                className="flex items-center gap-2 rounded-md bg-[#CFF1E6] px-2 py-1"
                            >
                                <Trash />
                                {t('delete')}
                            </button>
                            {/* <button className="flex items-center gap-2 rounded-md bg-[#F59E0B] px-2 py-1 text-white">
                                <Edit />
                                რედაქტირება
                            </button> */}
                        </div>
                    </div>
                </div>
            ))}
            <>
                <Pagination data={paginatedData} />
            </>
        </main>
    )
}

export default withAuth(ClientWrapper)
