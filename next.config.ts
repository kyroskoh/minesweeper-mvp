import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Optimize for production
  // experimental: {
  //   optimizeCss: true,
  // },
  
  // Disable ESLint during builds (for Docker compatibility)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Port configuration is handled via package.json scripts
  // Development: npm run dev (uses port 3001)
  // Production: npm start (uses port 3001)
  
  // Environment variables that should be available at build time
  env: {
    CUSTOM_PORT: '3001',
  },
  
  // Webpack configuration for path aliases (especially important for Docker builds)
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

export default nextConfig;
