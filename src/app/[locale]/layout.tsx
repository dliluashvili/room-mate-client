import TranslationsProvider from '@/src/libs/i18n/TranslationsProvider'
import { ApolloWrapper } from '@/src/libs/apollo/wrapper'
import initTranslations from '@/src/libs/i18n/i18n'
import { ReactNode, Suspense } from 'react'
import { dir } from 'i18next'
import './globals.css'
import Header from '@/src/components/header/Header'
import { Noto_Sans_Georgian } from 'next/font/google'
import Footer from '@/src/components/footer/Footer'
import { ModalWrapper } from './(auth)/_modal/ModalWrapper'
import { AuthWrapper } from '@/src/auth/authWrapper'
import TwilioClientWrapper from '@/src/conversation/TwilioClientWrapper'
import Script from 'next/script'
import { Partytown } from '@builder.io/partytown/react'
import { GoogleTagManager } from '@next/third-parties/google'

const georgian = Noto_Sans_Georgian({ subsets: ['latin'] })

export async function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'ka' }]
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const i18nNamespaces = ['meta']
    const { t } = await initTranslations(locale, i18nNamespaces)

    return {
        openGraph: {
            type: 'website',
            locale: locale,
            url: 'https://roommate.ge',
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

export default async function RootLayout({
    children,
    params: { locale },
}: {
    children: ReactNode
    modal: ReactNode
    params: { locale: string }
}) {
    const i18nNamespaces = [
        'home',
        'shared',
        'signup',
        'profile',
        'roommates',
        'signin',
        'uploadApartment',
        'conversation',
        'landlords',
        'common',
        'verification',
    ]

    const { resources } = await initTranslations(locale, i18nNamespaces)

    return (
        <html lang={locale} dir={dir(locale)} className={georgian.className}>
            <head>
                <Partytown debug={true} forward={['dataLayer.push', 'hj', 'hj.q']} />
                <Script id="google-tag-manager" strategy="worker">
                    {`
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-586WWRZ6');
                    `}
                </Script>
                <Script id="hotjar" strategy="worker">
                    {`
                        (function(h,o,t,j,a,r){
                            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                            h._hjSettings={hjid:3128732,hjsv:6};
                            a=o.getElementsByTagName('head')[0];
                            r=o.createElement('script');r.async=1;
                            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                            a.appendChild(r);
                        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                    `}
                </Script>
            </head>
            <body>
                <TranslationsProvider
                    namespaces={i18nNamespaces}
                    locale={locale}
                    resources={resources}
                >
                    <ApolloWrapper>
                        <AuthWrapper>
                            <TwilioClientWrapper>
                                <Suspense fallback={<></>}>
                                    <Header />
                                    <ModalWrapper />
                                </Suspense>

                                {children}
                                <Footer />
                            </TwilioClientWrapper>
                        </AuthWrapper>
                    </ApolloWrapper>
                </TranslationsProvider>
            </body>
            <GoogleTagManager gtmId="GTM-586WWRZ6" />
        </html>
    )
}
