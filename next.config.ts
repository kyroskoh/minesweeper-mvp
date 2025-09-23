import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Optimize for production
  experimental: {
    optimizeCss: true,
  },
  
  // Port configuration is handled via package.json scripts
  // Development: npm run dev (uses port 3001)
  // Production: npm start (uses port 3001)
  
  // Environment variables that should be available at build time
  env: {
    CUSTOM_PORT: '3001',
  },
};

export default nextConfig;
