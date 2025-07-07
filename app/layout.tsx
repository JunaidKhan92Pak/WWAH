import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "./(auth)/auth/authProvider";
import UserProvider from "@/components/UserProvider";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "World Wide Admission",
  description: "Your study abroad journey, simplified with AI",
};
// export const metadata: Metadata = {
//   title: "World Wide Admission Hub",
//   description: "Your study abroad journey, simplified with AI",
//   openGraph: {
//     title: "World Wide Admission Hub",
//     description: "Your study abroad journey, simplified with AI",
//     url: "https://www.wwah.ai/",
//     siteName: "World Wide Admission",
//     images: [
//       {
//         url: "https://www.wwah.ai/wwahpnglogo.png",
//         width: 800,
//         height: 600,
//         alt: "WWAH Logo",
//       },
//     ],
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "World Wide Admission Hub",
//     description: "Your study abroad journey, simplified with AI",
//     images: ["https://www.wwah.ai/WWAHlogo.svg"],
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TQR48WP22R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TQR48WP22R');
          `}
        </Script>

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '3269037289920282');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Facebook Pixel fallback for no-JS users */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=3269037289920282&ev=PageView&noscript=1"
          />
        </noscript>

        <AuthProvider>
          <UserProvider />
          {children}
          <WhatsAppWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
