import localFont from "next/font/local";

// Self-hosted to avoid any build/runtime dependency on Google Fonts.
export const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Poppins-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

export const playfair = localFont({
  src: [
    { path: "./fonts/PlayfairDisplay-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/PlayfairDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/PlayfairDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/PlayfairDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});
