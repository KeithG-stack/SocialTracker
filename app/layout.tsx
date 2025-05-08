// app/layout.tsx
import './globals.css';
import React from 'react';
import { Providers } from './providers';

export const metadata = {
  title: 'Social Dashboard',
  description: 'Manage all your social media platforms in one place',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}