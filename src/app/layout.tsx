import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Navbar } from "@/components/layout";
import { Playfair_Display, Nunito } from "next/font/google";

// ✅ Configure the fonts
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-playfair',
});

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: "B'Dazzle Cafe",
  description: "Dev Fortunbe",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${playfair.variable} ${nunito.variable}`}>
      <SessionProvider session={session}>
        <body className="select-none" suppressHydrationWarning>
          <Navbar />
          <main className="bg-gray-50 h-screen">{children}</main>
        </body>
      </SessionProvider >
    </html >
  );
}