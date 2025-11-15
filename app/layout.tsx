import InstallPrompt from "./components/InstallPrompt";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "My PWA App",
  description: "Next.js 14 PWA starter",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5a4" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />
      </head>
      <body>
        {children}

        {/* Install button floating */}
        <InstallPrompt />
      </body>
    </html>
  );
}
