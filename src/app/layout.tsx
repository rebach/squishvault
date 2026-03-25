import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FF85C2",
};

export const metadata: Metadata = {
  title: "SquishVault — Open. Collect. Squish.",
  description: "A digital collectible app inspired by viral squishy blind bags. Earn coins, open blind bags, and collect squishies!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SquishVault",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="max-w-[480px] mx-auto min-h-screen relative" style={{ background: 'var(--surface-bg)' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
