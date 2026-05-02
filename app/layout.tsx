import type { Metadata } from "next";
import { Fira_Sans, Great_Vibes, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "900"],
  variable: "--font-fira-sans", // CSS variable name
});

export const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "La Quinta Christian Fellowship Church",
  description:
    "La Quinta Christian Fellowship Church is a non-denominational church. Find service times, Bible studies for all ages, and gospel-centered teachings on the Gosepl of Jesus Christ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${firaSans.variable} ${greatVibes.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
