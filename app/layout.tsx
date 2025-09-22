
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Eci Auth",
  description: "Simple authentication with Next.js, Prisma and NextAuth.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>

      </body>
    </html>
  );
}
