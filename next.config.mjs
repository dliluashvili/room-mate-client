import { join } from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: { loader: '@svgr/webpack', options: { icon: true } },
        })

        // Add Partytown alias
        config.resolve.alias = {
            ...config.resolve.alias,
            '~partytown': join(process.cwd(), 'node_modules', '@builder.io', 'partytown'),
        }

        return config
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.roommategeorgia.ge',
                pathname: '/public/static/images/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '7777',
                pathname: '/public/static/images/**',
            },
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
            },
        ],
    },
    // Add Partytown headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp',
                    },
                ],
            },
        ]
    },
}

export default nextConfig
