import type { Metadata } from 'next';
import { Inter, Titillium_Web } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const titillium = Titillium_Web({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-titillium',
});

export const metadata: Metadata = {
  title: 'Grand Prix SENAI de Inovação',
  description: 'Mapa de competição — Grand Prix SENAI de Inovação 2026',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${titillium.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
