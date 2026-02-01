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
