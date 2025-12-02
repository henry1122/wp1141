import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '補習班管理系統',
  description: 'Next.js 補習班網站（登入、學生管理、課表）'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}


