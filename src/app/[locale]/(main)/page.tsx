import BlogSection from './_components/BlogSection'
import ConnectSection from './_components/ConnectSection'
import ContactSection from './_components/ContactSection'
import FeatureSection from './_components/FeatureSection'
import QuestionSection from './_components/QuestionSection'
import ReviewSection from './_components/ReviewSection'
import SuggestSection from './_components/SuggestSection'
import CoverSection from './_components/CoverSection'

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
