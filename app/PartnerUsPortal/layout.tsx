import type { Metadata } from "next";
import { AuthProvider } from "../(auth)/auth/authProvider";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// export const metadata: Metadata = {
//   title: "World Wide Admission",
//   description: "Your study abroad journey, simplified with AI",
// };
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

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Navbar fixed at top */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar />
          </div>

          {/* Sidebar below navbar but NOT fixed */}
          <div
            className="hidden lg:block pt-16 w-60 h-screen fixed left-0 top-0 z-40 bg-[#FCE7D2] overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <Sidebar />
          </div>

          {/* Main content with margin left to avoid sidebar */}
          <main className="pt-20 p-4 min-h-screen overflow-y-auto lg:ml-60">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
