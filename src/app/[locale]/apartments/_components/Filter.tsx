import { GetPropertiesFilterInput } from '@/graphql/typesGraphql'
import { CloseCircle } from '@/src/components/svgs'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Range = {
    from: null | number
    to: null | number
}
type Ranges = {
    priceRanges: Range[]
    bedroomsRanges: Range[]
    areaRanges: Range[]
}

type FilterProps = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    setFilterInputParams: Dispatch<SetStateAction<GetPropertiesFilterInput | undefined>>
}

export default function Filter({ isOpen, setIsOpen, setFilterInputParams }: FilterProps) {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const [ranges, setRanges] = useState<Ranges>({
        priceRanges: [{ from: null, to: null }],
        bedroomsRanges: [{ from: null, to: null }],
        areaRanges: [{ from: null, to: null }],
    })

    useEffect(() => {
        const newRanges: Ranges = {
            priceRanges: [{ from: null, to: null }],
            bedroomsRanges: [{ from: null, to: null }],
            areaRanges: [{ from: null, to: null }],
        }

        Object.keys(newRanges).forEach((rangeType) => {
            let index = 0
            while (true) {
                const fromValue = searchParams.get(`${rangeType}[${index}]From`) || 0
                const toValue = searchParams.get(`${rangeType}[${index}]To`)

                if (!fromValue && !toValue) break

                const parsedFrom = fromValue ? parseFloat(fromValue) : 0
                const parsedTo = toValue ? parseFloat(toValue) : null

                if (index === 0) {
                    newRanges[rangeType as keyof Ranges][0] = { from: parsedFrom, to: parsedTo }
                } else {
                    newRanges[rangeType as keyof Ranges].push({ from: parsedFrom, to: parsedTo })
                }

                index++
            }
        })
        setRanges(newRanges)

        const filterParams: GetPropertiesFilterInput = {
            priceRange: newRanges.priceRanges[0],
            bedroomsRange: newRanges.bedroomsRanges[0],
            areaRange: newRanges.areaRanges[0],
        }
        setFilterInputParams(filterParams)
    }, [searchParams, setFilterInputParams])

    const filterClearHandler = () => {
        const page = searchParams.get('page') || '1'
        const newPathname = `${pathname}?page=${page}`
        router.push(newPathname)
        setRanges({
            priceRanges: [{ from: null, to: null }],
            bedroomsRanges: [{ from: null, to: null }],
            areaRanges: [{ from: null, to: null }],
        })
    }

    const filterUpdateHandler = () => {
        setIsOpen(false)
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(ranges).forEach(([rangeType, rangeArray]) => {
            rangeArray.forEach((range, index) => {
                if (range.from !== null)
                    params.set(`${rangeType}[${index}]From`, range.from.toString())
                else params.delete(`${rangeType}[${index}]From`)
                if (range.to !== null) params.set(`${rangeType}[${index}]To`, range.to.toString())
                else params.delete(`${rangeType}[${index}]To`)
            })
        })

        router.push(pathname + '?' + params.toString())
    }

    const handleRangeChange = (
        rangeType: keyof Ranges,
        index: number,
        type: 'from' | 'to',
        value: string
    ) => {
        setRanges((prev) => ({
            ...prev,
            [rangeType]: prev[rangeType].map((range, i) =>
                i === index ? { ...range, [type]: value === '' ? null : value } : range
            ),
        }))
    }

    const renderRangeInputs = (rangeType: keyof Ranges, label: string) => (
        <div className="flex flex-col gap-2">
            <h3>{label}</h3>
            {ranges[rangeType].map((range, index) => (
                <div key={index} className="flex gap-2">
                    <div>
                        <Input
                            type="number"
                            id={`${rangeType}[${index}]From`}
                            placeholder={t('from')}
                            value={range.from ?? ''}
                            onChange={(e) =>
                                handleRangeChange(rangeType, index, 'from', e.target.value)
                            }
                            className="w-full border p-2"
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            id={`${rangeType}[${index}]To`}
                            value={range.to ?? ''}
                            placeholder={t('to')}
                            onChange={(e) =>
                                handleRangeChange(rangeType, index, 'to', e.target.value)
                            }
                            className="w-full border p-2"
                        />
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <section
            className={`${isOpen ? 'fixed z-[100000] h-screen w-full   overflow-auto border-t-2 px-6 py-6 sm:px-16 md:px-20 md:py-10' : 'relative p-0 md:w-[330px] xl:w-[420px] '} flex h-full w-full flex-col items-center gap-4 rounded-md  bg-white p-6 md:gap-6 md:shadow-md`}
        >
            {isOpen && (
                <div className="flex h-auto w-full flex-row items-center justify-end gap-3">
                    <button
                        className="rounded-md border  border-[#8c91a4] bg-[#F2F5FF] px-3 py-[2px]"
                        onClick={filterClearHandler}
                    >
                        {t('clearFilters')}
                    </button>
                    <CloseCircle
                        className="h-6 w-6  fill-[#F2F5FF]"
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>
            )}
            <div className="hidden h-auto w-full flex-row items-center justify-end hover:underline lg:flex">
                <button onClick={filterClearHandler}>{t('clearFilters')}</button>
            </div>

            <div className="flex flex-col gap-6">
                {renderRangeInputs('priceRanges', t('price'))}
                {renderRangeInputs('bedroomsRanges', t('bedrooms'))}
                {renderRangeInputs('areaRanges', t('area'))}
            </div>

            <Button variant="filter" onClick={filterUpdateHandler} className="mt-6 w-full">
                {t('searchBtn')}
            </Button>
        </section>
    )
}
