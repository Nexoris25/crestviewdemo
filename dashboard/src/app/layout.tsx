import type { Metadata } from "next";
import { poppins, playfair } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrestView Admin — Leads Dashboard",
  description: "Manage and qualify inbound leads with AI insights.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
