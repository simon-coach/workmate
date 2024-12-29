/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/convex/:path*",
        destination: "https://honorable-mandrill-426.convex.cloud/:path*",
      },
    ];
  },
};

export default nextConfig;
