/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export → deploys free & forever on Vercel, Netlify,
  // Cloudflare Pages, Render (Static Site) or GitHub Pages. No server, no cold starts.
  output: 'export',
  images: {
    // Required for static export (no Next.js image optimization server at runtime).
    unoptimized: true,
  },
  reactStrictMode: true,
  // three.js ships ESM that occasionally needs transpiling by Next.
  transpilePackages: ['three'],
};

export default nextConfig;
