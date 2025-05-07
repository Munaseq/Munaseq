/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "munaseq.s3.eu-north-1.amazonaws.com",
      "prod-munaseq.s3.me-south-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
