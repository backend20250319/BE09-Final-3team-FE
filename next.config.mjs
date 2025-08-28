/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**.xx.fbcdn.net',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: '**.cdninstagram.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
