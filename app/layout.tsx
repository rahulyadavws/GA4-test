import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; 
import Script from "next/script";            
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
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
  title: {
    default: "HireDesk - Hiring Management System",
    template: "%s | HireDesk",
  },
  description:
    "A demo hiring management system built with Next.js, TypeScript and Tailwind CSS.",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 font-sans text-slate-900">
      <Script
  src="https://www.googletagmanager.com/gtag/js?id=G-6YRHCNWHRF"
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-6YRHCNWHRF');
  `}
</Script>

        
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
