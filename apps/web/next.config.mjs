/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      { source: "/api-backend/:path*", destination: "http://localhost:3000/:path*" },
    ];
  },
};

export default nextConfig;
