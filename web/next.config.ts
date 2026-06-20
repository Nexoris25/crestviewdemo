import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache strategy that survives rebuild + restart without stale chunks:
  //  - /_next/static/* is content-hashed, so it is safe to cache forever.
  //  - Everything else (HTML documents, RSC payloads, /public files) must be
  //    revalidated, so after a new deploy the browser always fetches fresh HTML
  //    that references the new chunk hashes — it never requests a chunk that the
  //    rebuild removed. This is what prevents the "page couldn't load" until a
  //    manual reload.
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/((?!_next/static|_next/image).*)",
        headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
