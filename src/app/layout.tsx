import Navbar from "@/components/navbar/Navbar";
import Provider from "@/providers/Provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School",
  description:
    "School is a full-stack app built with Next.js, TypeScript, Tailwind CSS, and Prisma. It allows users to search for schools, view information about schools, and add new schools to the database.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <div className="min-h-screen">
            <Navbar />
            <main>{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
