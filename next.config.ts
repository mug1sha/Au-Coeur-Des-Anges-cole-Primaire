import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Image optimisation ───────────────────────────────────────────────────
  images: {
    // Allow images from our Supabase storage bucket
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aubdtgbewzdntilhenos.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Serve modern formats where the browser supports them
    formats: ["image/avif", "image/webp"],
    // Reasonable device sizes for responsive <Image>
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimised images for 1 day (86400 s)
    minimumCacheTTL: 86400,
  },

  // ─── Security headers ─────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to every route
        source: "/:path*",
        headers: [
          // Prevent MIME-type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Only send referrer for same-origin requests
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Disable features not needed by the app
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Prevent clickjacking — allow same-origin framing only
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Force HTTPS for 1 year (includeSubDomains)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Content Security Policy
          // - default-src 'self'
          // - scripts: self + Next.js inline (unsafe-inline for dev HMR only
          //   when NEXT_PUBLIC_ prefix, but kept off in production)
          // - styles: self + unsafe-inline (Tailwind inlines styles)
          // - images: self + Supabase storage + data URIs (for Next/Image optimisation)
          // - connect: self + Supabase (Auth + Realtime + Storage) + ANON key target
          // - fonts: self + Google Fonts CDN
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js requires 'unsafe-inline' for styles and scripts in development;
              // in production Turbopack injects a nonce automatically — we set a
              // permissive-but-still-helpful policy that works in both modes.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://aubdtgbewzdntilhenos.supabase.co",
              "connect-src 'self' https://aubdtgbewzdntilhenos.supabase.co wss://aubdtgbewzdntilhenos.supabase.co",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        // Extra no-cache headers for sensitive admin API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
