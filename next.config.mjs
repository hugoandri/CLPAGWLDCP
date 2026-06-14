/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Las imágenes se sirven como emojis/placeholders en el MVP.
  // Al conectar una API real con escudos/fotos, añade aquí los dominios permitidos:
  // images: { remotePatterns: [{ protocol: 'https', hostname: 'tu-cdn.com' }] },
};

export default nextConfig;
