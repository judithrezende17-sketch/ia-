import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arena de Jogos - Xadrez & Jogo da Memória',
  description: 'Plataforma interativa de jogos com Xadrez FIDE completo (IA e 2 jogadores) e Jogo da Memória dinâmico com múltiplos temas, modos e efeitos sonoros.',
  openGraph: {
    title: 'Arena de Jogos - Xadrez & Jogo da Memória',
    description: 'Plataforma interativa de jogos com Xadrez FIDE completo (IA e 2 jogadores) e Jogo da Memória dinâmico com múltiplos temas, modos e efeitos sonoros.',
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
