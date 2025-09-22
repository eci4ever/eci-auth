import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
