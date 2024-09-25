'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/src/components/ui/carousel'
import { useTranslation } from 'react-i18next'
import FemaleAvatar from '@images/FemaleAvatar.jpg'
import MaleAvatar from '@images/MaleAvatar.jpg'
import Image from 'next/image'
import { RateStar } from '@/src/components/svgs'

export default function ReviewSection() {
    const { t } = useTranslation()
    const data = [
        {
            header: t('reviewName1'),
            text: t('reviewText1'),
            image: FemaleAvatar,
        },
        {
            header: t('reviewName2'),
            text: t('reviewText2'),
            image: FemaleAvatar,
        },
        {
            header: t('reviewName3'),
            text: t('reviewText3'),
            image: MaleAvatar,
        },
        {
            header: t('reviewName4'),
            text: t('reviewText4'),
            image: FemaleAvatar,
        },
    ]
    return (
        <section className="my-12 flex w-full flex-col items-start px-6 sm:px-16 md:px-20 xl:px-24">
            <h1 className="font-bgCaps text-xl ">{t('reviewsHead')}</h1>
            <Carousel
                opts={{
                    align: 'start',
                }}
                className="mt-6 w-full p-0"
            >
                <CarouselContent className="ml-1 gap-4 pr-10 lg:pr-20">
                    {data.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="w-full rounded-xl border border-gray-300 bg-[#FFFFFF] md:basis-1/2 lg:basis-1/3"
                        >
                            <div className="flex w-full flex-col px-4 py-6">
                                <div className="flex w-full flex-row items-center">
                                    <div className="relative h-14 w-14 rounded-full">
                                        <Image
                                            src={item.image}
                                            className="h-full max-w-full rounded-full object-cover"
                                            alt="Female/male avatar"
                                        />
                                    </div>
                                    <h1 className="ml-4 text-xs font-bold">{item.header}</h1>
                                    <div className="ml-14 flex flex-row items-center">
                                        <RateStar className="relative h-4 w-4" />
                                        <span className="ml-1 text-[14px] font-semibold ">5.0</span>
                                    </div>
                                </div>
                                <p className="text-[ #484848] mt-4 text-xs">{item.text}</p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious />
                </div>
                <div className="hidden md:block">
                    <CarouselNext />
                </div>
            </Carousel>
        </section>
    )
}
