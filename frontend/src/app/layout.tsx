import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/lib/auth";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gefylen - Virtuell Café",
  description: "En café i cyberspace med oppskrifter og quizzer",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <div className="flex min-h-screen">
            <div className="flex flex-col">
              <Sidebar />
            </div>
            <div className="flex-1 flex flex-col">
              <main className="flex-1 p-8">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
