import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "World Wide Admission Hub",
  description: "Your study abroad journey, simplified with AI",
  openGraph: {
    title: "World Wide Admission Hub",
    description: "Your study abroad journey, simplified with AI",
    url: "https://www.wwah.ai/",
    siteName: "World Wide Admission",
    images: [
      {
        url: "https://www.wwah.ai/WWAHlogo.svg",
        width: 800,
        height: 600,
        alt: "WWAH Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Wide Admission Hub",
    description: "Your study abroad journey, simplified with AI",
    images: ["https://www.wwah.ai/WWAHlogo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
