import type { Metadata } from "next";
import "./globals.css";
import { manrope, sora } from "@/lib/fonts";
import AppProviders from "@/components/providers/app-providers";
import GlobalSceneCanvas from "@/components/canvas/GlobalSceneCanvas";
import { GoogleAnalytics } from "@next/third-parties/google";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "David Beauchamp's developer portfolio",
  description:
    "I am a full-stack developer with a passion for building web applications. I am currently looking for a new opportunity. Please contact me if you have any questions or would like to discuss a potential project.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    images: [
      {
        url: "/meta-share.jpg",
        width: 1024,
        height: 1024,
        alt: "David Beauchamp's developer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/meta-share.jpg"],
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
      <body className="creative-body">
        <AppProviders>
          <GlobalSceneCanvas />
          {children}
        </AppProviders>
      </body>
      <GoogleAnalytics gaId="G-PBHQ84CY3T" />
    </html>
  );
}
