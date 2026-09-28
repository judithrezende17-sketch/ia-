import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Jogo da Memória',
  description: 'Jogo da memória interativo com múltiplos temas, modos solo e 2 jogadores, efeitos sonoros e estatísticas.',
  openGraph: {
    title: 'Jogo da Memória',
    description: 'Jogo da memória interativo com múltiplos temas, modos solo e 2 jogadores, efeitos sonoros e estatísticas.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jogo da Memória',
    description: 'Jogo da memória interativo com múltiplos temas, modos solo e 2 jogadores, efeitos sonoros e estatísticas.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">{children}</body>
    </html>
  );
}
