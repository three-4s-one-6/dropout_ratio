import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tamil Nadu Student Migration Analysis',
  description: 'Interactive visualization of student dropout and migration patterns across Tamil Nadu districts, taluks, and villages.',
  keywords: ['Tamil Nadu', 'student migration', 'education data', 'GIS visualization', 'dropout analysis'],
  openGraph: {
    title: 'Tamil Nadu Student Migration Analysis',
    description: 'Interactive visualization of student dropout and migration patterns',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}