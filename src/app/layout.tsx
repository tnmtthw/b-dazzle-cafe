import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import Navbar from '@/component/NavbarFixed';

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
    <html lang="en">
      <SessionProvider session={session}>
        <body className="select-none">
          {/* <Navbar /> */}
          <main>{children}</main>
        </body>
      </SessionProvider>
    </html>
  );
}
