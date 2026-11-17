import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '슬립메이트 | 데이터 기반 수면 컨설턴트',
  description: '매일 밤 스마트폰을 보느라 잠드는 시간을 놓치는 당신을 위한 90분 렘수면 주기 최적화 컨설팅',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark h-full antialiased">
      <body className="min-h-full bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
