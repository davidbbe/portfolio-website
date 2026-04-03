import type { Metadata } from "next";
import "./globals.css";
import { manrope, sora } from "@/lib/fonts";
import AppProviders from "@/components/providers/app-providers";
import GlobalSceneCanvas from "@/components/canvas/GlobalSceneCanvas";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Creative Portfolio",
  description: "Premium frontend engineering and immersive web experiences.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} antialiased`}
    >
      <body className="creative-body" style={{ backgroundColor: "#06080f" }}>
        <AppProviders>
          <GlobalSceneCanvas />
          {children}
        </AppProviders>
      </body>
      <GoogleAnalytics gaId="G-PBHQ84CY3T" />
    </html>
  );
}
