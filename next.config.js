/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Next.js sirve archivos estáticos desde /public automáticamente
  // Los archivos en public/uploads estarán disponibles en /uploads
};

export default nextConfig;

