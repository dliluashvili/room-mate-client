import Pagination from '@/src/components/shared/pagination/Pagination'
import { useQuery } from '@apollo/client'
import { FilterInput, Language, PaginatedFilteredRoommatesObject } from '@/graphql/typesGraphql'
import { GetPaginatedFilteredRoommatesQuery } from '@/graphql/query'
import { useParams, useSearchParams } from 'next/navigation'
import UserCardLoading from '../loaders/UserCardLoading'
import UserCard from '../userCard/UserCard'

type UserCardProps = {
    transformedParams: FilterInput[]
}

export default function UserList({ transformedParams }: UserCardProps) {
    const params = useParams()
    const searchParams = useSearchParams()
    const page = searchParams.get('page') || '1'
    const locale = params.locale
    const currentPage = page ? parseInt(page, 10) : 1
    const limit = 10
    const offset = (currentPage - 1) * limit

    const { loading, error, data } = useQuery(GetPaginatedFilteredRoommatesQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            pagination: {
                offset,
                limit,
            },
            locale: locale as Language,
            filters: transformedParams,
        },
    })
    const FilteredUsers = data?.getPaginatedFilteredRoommates as PaginatedFilteredRoommatesObject

    if (loading) return <UserCardLoading />
    if (error) return <p>{error.message}</p>

    return (
        <section className="flex min-h-screen w-full flex-col items-center justify-between gap-10 px-6 py-6  sm:px-16  md:px-20 md:py-10 lg:px-0 lg:py-0 xl:w-auto">
            <div className="flex w-full  flex-col items-center justify-center gap-6 xl:w-auto">
                {data?.getPaginatedFilteredRoommates?.list &&
                data.getPaginatedFilteredRoommates.list.length ? (
                    data.getPaginatedFilteredRoommates.list.map((item, index) => (
                        <UserCard key={index} user={item} />
                    ))
                ) : (
                    <div className="flex w-full justify-center xl:w-[770px]">no users </div>
                )}
            </div>

            {data?.getPaginatedFilteredRoommates?.list?.length ? (
                <Pagination data={FilteredUsers} />
            ) : null}
        </section>
    )
}
