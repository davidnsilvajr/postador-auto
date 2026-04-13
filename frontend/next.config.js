/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.openai.com' },
    ],
  },
  // API URL configuravel via NEXT_PUBLIC_API_URL
  // Dev: http://localhost:8000/api/v1
  // Prod: URL do seu backend (Railway, Render, etc.)
};

module.exports = nextConfig;
