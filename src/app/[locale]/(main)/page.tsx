import BlogSection from './_components/BlogSection'
import ConnectSection from './_components/ConnectSection'
import ContactSection from './_components/ContactSection'
import FeatureSection from './_components/FeatureSection'
import QuestionSection from './_components/QuestionSection'
import ReviewSection from './_components/ReviewSection'
import SuggestSection from './_components/SuggestSection'
import CoverSection from './_components/CoverSection'
import initTranslations from '@/src/libs/i18n/i18n'


export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const i18nNamespaces = ['meta']
    const { t } = await initTranslations(locale, i18nNamespaces)

    return {
        // title: t('news'),
        // description: t('describeNews'),
        openGraph: {
            // title: t('news'),
            // description: t('describeNews'),
            type: 'website',
            locale: locale,
            url: 'https://roommate.ge/',
            siteName: 'Roommate',
            images: [
                {
                    url: '/images/RoommateOpengraph.png',
                },
            ],
        },
        metadataBase: new URL('https://roommate.ge'),
    }
}

function Home() {
    return (
        <main className="h-full w-full">
            <CoverSection />
            <FeatureSection />
            <BlogSection />
            <SuggestSection />
            <ConnectSection />
            <ContactSection />
            <ReviewSection />
            <QuestionSection />
        </main>
    )
}

export default Home
