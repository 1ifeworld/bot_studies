import '../styles/globals.css';
import type { Metadata } from 'next';
import { helveticaNeue } from './fonts/fonts';

export const metadata: Metadata = {
  title: 'River',
  description: 'Set information free',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${helveticaNeue.variable}`}>
      <body>{children}</body>
    </html>
  );
}
