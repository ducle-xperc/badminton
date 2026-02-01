import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XPERC Badminton Vietnam Arena",
  description: "XPERC Badminton World Cup - Live Tournament",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#135bec" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${lexend.variable} antialiased`}>
        <div className="min-h-screen flex flex-col relative">
          <BackgroundGradient />
          {children}
        </div>
      </body>
    </html>
  );
}
