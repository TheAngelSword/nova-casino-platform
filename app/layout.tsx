import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'NOVA Casino Studio',
  description: 'Plataforma de producción para juegos de casino y mini games'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster richColors theme="dark" />
      </body>
    </html>
  );
}
