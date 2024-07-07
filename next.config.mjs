/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.DEV_MODE
          ? "http://localhost:4000/:path*"
          : "https://3reco-api.vps2.lone-wolf.dev/:path*",
      },
    ];
  },
};

export default nextConfig;
