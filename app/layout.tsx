import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StarsCanvas from '@/components/main/StarBackground';
import Navbar from '@/components/main/Navbar';
import Footer from '@/components/main/Footer';
import { Suspense } from 'react';

// Optimize font loading with display: swap
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Space Portfolio',
  description:
    'Interactive space-themed portfolio showcasing developer skills and projects',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  // Add metadataBase to resolve the warning
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  // Add other metadata for performance
  themeColor: '#030014',
  manifest: '/manifest.json',
  // Add important SEO tags
  openGraph: {
    title: 'Space Portfolio',
    description: 'Interactive space-themed portfolio',
    url: '/',
    siteName: 'Space Portfolio',
    images: [
      {
        url: '/profiol3.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/cards-video.webm"
          as="video"
          type="video/webm"
        />
      </head>
      <body
        className={`${inter.className} bg-[#030014] overflow-y-scroll overflow-x-hidden`}>
        <Suspense fallback={<div className="bg-[#030014] min-h-screen" />}>
          <StarsCanvas />
          <Navbar />
          {children}
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
