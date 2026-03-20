import "./globals.css";
import { manrope, sora } from "@/lib/fonts";
import AppProviders from "@/components/providers/app-providers";
import GlobalSceneCanvas from "@/components/canvas/GlobalSceneCanvas";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "Creative Portfolio",
  description: "Premium frontend engineering and immersive web experiences.",
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
