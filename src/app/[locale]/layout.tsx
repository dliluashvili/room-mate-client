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
import { GoogleTagManager } from '@next/third-parties/google'
import Script from 'next/script'
import dynamic from 'next/dynamic'
const ChatraComponent = dynamic(() => import('@/src/components/chat/Chat'), {
    ssr: false,
})

const georgian = Noto_Sans_Georgian({ subsets: ['latin'] })

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
            <Script
                id="hotjar-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        (function(h,o,t,j,a,r){
                            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                            h._hjSettings={hjid:5156615,hjsv:6};
                            a=o.getElementsByTagName('head')[0];
                            r=o.createElement('script');r.async=1;
                            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                            a.appendChild(r);
                        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                    `,
                }}
            />
            <Script
                id="meta-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '1185072756167867');
                        fbq('track', 'PageView');
                    `,
                }}
            />

            <body>
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: 'none' }}
                        src="https://www.facebook.com/tr?id=1185072756167867&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>
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
                                <ChatraComponent />
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
