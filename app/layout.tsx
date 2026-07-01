import type { Metadata } from 'next';
import { SiteNav } from '@/components/shared/SiteNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'MLtravel',
  description: 'MLtravel Frontend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <SiteNav />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
