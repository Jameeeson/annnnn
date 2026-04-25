import type { Metadata } from 'next';
import './globals.css';
import { TimeLock } from '@/components/ui/TimeLock';
import { MusicPlayer } from '@/components/ui/MusicPlayer';

export const metadata: Metadata = {
  title: 'Our Anniversary Journey',
  description: 'A digital love story and memory keeper.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-black text-zinc-100 font-sans antialiased overflow-x-hidden selection:bg-zinc-800 selection:text-white">
        <TimeLock targetDate="2026-05-01T00:00:00+08:00">
          <MusicPlayer />
          <main className="relative flex min-h-screen flex-col bg-black">
            {children}
          </main>
        </TimeLock>
      </body>
    </html>
  );
}
