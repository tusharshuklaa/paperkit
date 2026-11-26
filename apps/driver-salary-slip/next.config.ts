import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.80'],
  transpilePackages: ['@repo/document-engine', '@repo/ui', '@repo/platform-shell'],
};

export default nextConfig;
