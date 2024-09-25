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
        domains: ['img.roommategeorgia.ge', 'flagcdn.com', 'localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.roommategeorgia.ge',
                port: '',
                pathname: '/public/static/images/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '7777',
                pathname: '/public/static/images/**',
            },
        ],
    },
}

export default nextConfig
