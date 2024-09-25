import Link from 'next/link'
import { FbIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from '@/src/components/svgs'
import { FACEBOOK_URL, INSTAGRAM_URL, LINKEDIN_URL, WHATSAPP_URL } from '@/src/constants/links'

export const SocialIcons = () => {
    return (
        <>
            <div className="flex flex-row  gap-x-6">
                <Link target="_blank" href={FACEBOOK_URL}>
                    <FbIcon className="h-8 w-8 cursor-pointer" />
                </Link>
                <Link target="_blank" href={INSTAGRAM_URL}>
                    <InstagramIcon className="h-8 w-8 cursor-pointer" />
                </Link>
                <Link target="_blank" href={WHATSAPP_URL}>
                    <WhatsappIcon className="h-8 w-8 cursor-pointer" />
                </Link>
                <Link target="_blank" href={LINKEDIN_URL}>
                    <LinkedinIcon className="h-8 w-8 cursor-pointer" />
                </Link>
            </div>
        </>
    )
}
