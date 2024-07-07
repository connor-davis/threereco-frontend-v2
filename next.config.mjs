/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.DEV_MODE
          ? "http://localhost:4000/:path*"
          : "https://api.3reco.co.za/:path*",
      },
    ];
  },
};

export default nextConfig;
