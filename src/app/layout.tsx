import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Navbar } from "@/component/Navbar";
import { Playfair_Display } from "next/font/google";

// ✅ Configure the font
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-playfair',
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
    <html lang="en" className={playfair.className}>
      <SessionProvider session={session}>
        <body className="select-none">
          <Navbar />
          <main>{children}</main>
        </body>
      </SessionProvider>
    </html>
  );
}
