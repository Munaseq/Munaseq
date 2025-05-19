/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      `${process.env.S3_BUCKET}`
    ],
  },
};

export default nextConfig;
