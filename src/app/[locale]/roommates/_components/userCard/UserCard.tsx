import Avatar from '@images/UniversalAvatar.webp'
import { Heart, Location } from '@/src/components/svgs'
import Link from 'next/link'
import Image from 'next/image'
import { RoommateWithAdditionalInfoObject } from '@/graphql/typesGraphql'
import { useTranslation } from 'react-i18next'
import ConversationWindow from '@/src/components/shared/conversationWindow/ConversationWindow'
import { useState } from 'react'
import SendMessageButton from '@/src/components/shared/sendMessageButton/SendMessageButton'

type Props = {
    user: RoommateWithAdditionalInfoObject
}

const UserCard = ({ user }: Props) => {
    const [isOpenedConversationWindow, setIsOpenedConversationWindow] = useState(false)

    const { t } = useTranslation()

    return (
        <>
            {isOpenedConversationWindow && (
                <ConversationWindow
                    setIsOpen={setIsOpenedConversationWindow}
                    name={user.firstname}
                    participantId={user.id}
                    avatar={user.profileImage ?? ''}
                />
            )}
            <div className="flex h-auto w-full flex-col gap-6 overflow-hidden rounded-lg bg-[#FFFFFF] shadow-md sm:h-[232px] sm:w-full sm:flex-row sm:p-4 xl:w-[770px] ">
                <Link href={`roommates/${user.id}`}>
                    <Image
                        src={user?.profileImage ? user?.profileImage : Avatar}
                        width={400}
                        height={600}
                        className="h-[200px] w-full rounded-lg object-cover sm:h-full  sm:w-[332px]"
                        alt="test"
                        priority
                    />
                </Link>
                <div id="inside" className="flex h-full w-full flex-col gap-4 p-4 pb-3 pt-4 sm:p-0">
                    <div className="flex h-auto w-full flex-row  items-center justify-between">
                        <div className="flex flex-row  items-center gap-1 ">
                            <span className="text-base font-semibold sm:text-sm">
                                {user.firstname} -
                            </span>
                            <span className="text-sm text-[#838CAC]">
                                {user.age} {t('yearsOld')}
                            </span>
                        </div>
                        <SendMessageButton
                            userId={user.id}
                            setIsOpenedConversationWindow={setIsOpenedConversationWindow}
                        />
                    </div>
                    <div className="hidden h-[1px] w-full bg-[#E3E3E3] sm:block"></div>
                    <span className=" line-clamp-1 h-full overflow-clip text-ellipsis text-sm sm:line-clamp-2">
                        {user?.bio}
                    </span>
                    <div className="flex h-auto w-full flex-row items-center justify-between">
                        <div className="flex w-full flex-row gap-2 ">
                            <span className="text-sm text-[#838CAC]">{t('userBudget')}</span>
                            <span className="text-sm">
                                {user?.budget}$ / {t('perMonth')}
                            </span>
                        </div>
                    </div>
                    <div className="h-[1px] w-full bg-[#E3E3E3]"></div>
                    <div className="flex h-auto w-full flex-row items-center justify-between">
                        <div className="flex w-full flex-row items-center gap-3 ">
                            <Location className="h-5 w-5" />

                            <div className="w-3/4">
                                <span className="line-clamp-1 w-full text-ellipsis text-sm">
                                    {user?.districtNames}
                                </span>
                            </div>
                        </div>
                        <div className="flex cursor-pointer flex-row items-center gap-3">
                            <Heart />
                            <span className="text-sm">{t('fav')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserCard
