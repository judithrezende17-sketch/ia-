import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arena de Jogos - Xadrez & Jogo da Memória',
  description: 'Plataforma interativa de jogos clássicos: Xadrez FIDE, Jogo de Damas 8x8 oficial com regras brasileiras/clássicas e IA, e Jogo da Memória dinâmico com efeitos sonoros procedurais.',
  openGraph: {
    title: 'Arena de Jogos - Xadrez & Jogo da Memória',
    description: 'Plataforma interativa de jogos clássicos: Xadrez FIDE, Jogo de Damas 8x8 oficial com regras brasileiras/clássicas e IA, e Jogo da Memória dinâmico com efeitos sonoros procedurais.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-950 text-neutral-100 overflow-x-hidden antialiased select-none font-sans">
        {children}
      </body>
    </html>
  );
}
