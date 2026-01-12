/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Adicione esta linha
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
