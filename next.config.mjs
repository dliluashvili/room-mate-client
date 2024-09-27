/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: { loader: '@svgr/webpack', options: { icon: true } },
        })
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
}

export default nextConfig
