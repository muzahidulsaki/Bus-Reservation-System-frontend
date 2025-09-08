import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Memory optimization এবং performance improvement
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Webpack configuration for memory optimization
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Development mode memory optimization
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
      
      // Reduce memory usage
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: true, // Disable image optimization for development
  },
  
  // Compress static files
  compress: true,
  
  // Power efficiency
  poweredByHeader: false,
};

export default nextConfig;
