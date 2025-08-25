import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.obsession.si',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Evita que errores de ESLint bloqueen el build en Vercel
    ignoreDuringBuilds: true,
  },
  // Si deseas permitir builds aún con errores de TypeScript, descomenta:
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
