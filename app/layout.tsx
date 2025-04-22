import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { metadata as siteMetadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
