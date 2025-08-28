/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "dev.macacolabs.site",
        port: "8008",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
