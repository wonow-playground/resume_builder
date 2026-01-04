/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 테일윈드 CSS 파싱 최적화
    optimizePackageImports: ['lucide-react'],
  },
  // 이미지 최적화
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // CSS 설정
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  // 번들러 설정
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // 타입 체크
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  // Turbopack 설정
  turbopack: {},
};

module.exports = nextConfig;