import type { Metadata } from "next";
import { AuthProvider } from "../(auth)/auth/authProvider";
import MobileNavbar from "@/components/MobileNavbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MobileNavbar />
        <Navbar/>
        <AuthProvider>{children}</AuthProvider>
        <Footer />
      </body>
    </html>
  );
}



