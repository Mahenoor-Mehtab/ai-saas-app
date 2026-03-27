import type { Metadata } from "next";
import { ClerkProvider} from '@clerk/nextjs'
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
  title: "Genius",
  description: "AI Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <ClerkProvider>
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
       <head>
        {/* ✅ Yeh line add kar - Puter.js load hoga */}
        <script src="https://js.puter.com/v2/" defer></script>
      </head>
      <body className="min-h-full flex flex-col">
      
       
       {children}
      
      
      
      </body>
    </html>
    </ClerkProvider>
  );
}
