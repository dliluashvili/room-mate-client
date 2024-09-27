'use client'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/src/components/ui/carousel'
import Link from 'next/link'

import { useTranslation } from 'react-i18next'
import { Door, Location, Square } from '@/src/components/svgs'
import Image from 'next/legacy/image'

type Flat = {
    id: string
    title: string
    area: string
    room: number
    address: string
    images: { original: string }[]
    price: string
    street: string
}

type ApartmentSectionProps = {
    flats: Flat[]
}

export default function ApartmentSection({ flats }: ApartmentSectionProps) {
    const { t } = useTranslation()

    return (
        <>
            <section>
                <h1 className="pb-6 pl-6 pt-12 text-2xl text-[#484848] sm:px-16 md:px-20 lg:pb-7 lg:pt-12 xl:px-24">
                    {t('findAffordable')}
                </h1>
                <div className="relative flex w-full flex-col items-start pb-8 pl-6 sm:px-16 md:px-20 xl:px-24">
                    <Carousel className="w-full p-0">
                        <CarouselContent className="pr-12 lg:pr-16">
                            {flats &&
                                flats.map((item) => (
                                    <CarouselItem
                                        key={item.id}
                                        className="cursor-pointer sm:basis-1/2 lg:basis-1/3 xl:basis-1/4  "
                                    >
                                        <div className=" flex w-auto cursor-pointer flex-col items-start justify-start overflow-auto text-ellipsis whitespace-nowrap rounded-xl border">
                                            <div className="relative h-[250px] w-full overflow-hidden ">
                                                <Image
                                                    objectFit="cover"
                                                    layout="fill"
                                                    src={item.images[0].original}
                                                    alt="Apartment image"
                                                />
                                            </div>
                                            <div className="relative flex w-full flex-col p-4">
                                                <h1 className="text-xl font-bold text-[#484848]">
                                                    {item.price} $/ {t('inMonth')}
                                                </h1>
                                                <div className="mt-3 flex flex-row items-center">
                                                    <div className="flex flex-row items-center">
                                                        <Door />
                                                        <p className="ml-2 text-sm text-[#484848]">
                                                            {t('room')}: {item.room}
                                                        </p>
                                                    </div>
                                                    <div className="ml-10 flex flex-row items-center text-ellipsis">
                                                        <Square />
                                                        <p className="ml-2 text-ellipsis text-sm text-[#484848]   ">
                                                            {t('area')} - {item.area}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex flex-row items-center">
                                                    <Location />
                                                    <p className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#484848]">
                                                        {item.street}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                        </CarouselContent>
                        <div className="hidden md:block">
                            <CarouselPrevious />
                            <CarouselNext />
                        </div>
                    </Carousel>
                </div>
                <div className="flex w-full items-center justify-center overflow-hidden px-6 sm:px-16 md:items-end md:justify-end md:px-20 xl:px-24 ">
                    <button className="w-full rounded-md border border-[#838CAC] py-2 text-sm text-[#838CAC] underline-offset-2 md:w-auto md:border-none md:text-[#484848] md:md:underline">
                        <Link className="w-auto" href="/#">
                            {t('viewAll')}
                        </Link>
                    </button>
                </div>
            </section>
        </>
    )
}
