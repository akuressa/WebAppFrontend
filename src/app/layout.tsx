import type { Metadata } from 'next';
import '../index.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Product Dashboard',
  description: 'Browse and search products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

