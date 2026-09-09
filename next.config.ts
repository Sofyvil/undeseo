import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Por defecto Next.js corta en 1mb las subidas por server action
      // (por ejemplo, la foto de un producto sugerido en /admin).
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
