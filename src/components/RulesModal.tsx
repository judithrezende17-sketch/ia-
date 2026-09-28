import React from 'react';
import { X, HelpCircle, Crown, Shield, Sparkles, BookOpen } from 'lucide-react';
import { chessAudio } from '../audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col space-y-5 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-chess uppercase">
                Regras Oficiais do Xadrez
              </h2>
              <p className="text-xs text-neutral-400">Guia de movimentos e conceitos essenciais</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              chessAudio.playClick();
              onClose();
            }}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs text-neutral-300">
          
          {/* Card 1: Objetivo Principal */}
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Objetivo do Jogo: O Xeque-Mate</span>
            </div>
            <p className="leading-relaxed text-neutral-400">
              O objetivo no xadrez é colocar o <strong>Rei adversário em xeque-mate</strong>, uma situação em que o rei está sob ataque direto (em xeque) e não possui nenhum lance legal para escapar, bloquear o ataque ou capturar a peça agressora.
            </p>
          </div>

          {/* Card 2: Como as Peças se Movem */}
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Movimento das Peças</span>
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <strong className="text-white">Rei:</strong> Move-se 1 casa em qualquer direção (horizontal, vertical ou diagonal).
              </li>
              <li>
                <strong className="text-white">Dama (Rainha):</strong> A peça mais poderosa; move-se qualquer número de casas em linha reta ou diagonal.
              </li>
              <li>
                <strong className="text-white">Torre:</strong> Move-se em linhas retas horizontais ou verticais por quantas casas desejar.
              </li>
              <li>
                <strong className="text-white">Bispo:</strong> Move-se exclusivamente em diagonais mantendo a cor da sua casa de origem.
              </li>
              <li>
                <strong className="text-white">Cavalo:</strong> Move-se em formato de "L" (2 casas em uma direção e 1 perpendicular) e é a única peça capaz de pular sobre outras.
              </li>
              <li>
                <strong className="text-white">Peão:</strong> Move-se 1 casa para frente (ou 2 casas no primeiro movimento). Captura apenas 1 casa na diagonal à frente.
              </li>
            </ul>
          </div>

          {/* Card 3: Lances Especiais */}
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Lances Especiais Importantes</span>
            </div>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <strong className="text-amber-300">Roque (Castling):</strong> O Rei e uma Torre se movem simultaneamente para proteger o rei e ativar a torre. Permitido se nenhuma das duas peças tiver se movido ainda e o caminho estiver livre de ataques.
              </li>
              <li>
                <strong className="text-sky-300">Promoção do Peão:</strong> Quando um peão atinge a última fileira do tabuleiro (fileira 8 para as brancas, 1 para as pretas), ele é promovido imediatamente a Dama, Torre, Bispo ou Cavalo.
              </li>
              <li>
                <strong className="text-emerald-300">En Passant (Na Passagem):</strong> Se um peão avança 2 casas e para ao lado de um peão adversário, este pode capturá-lo na diagonal como se tivesse avançado apenas 1 casa.
              </li>
            </ul>
          </div>

          {/* Card 4: Afogamento vs Xeque-Mate */}
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1.5">
            <div className="font-bold text-white text-sm">Diferença: Xeque-Mate vs Afogamento (Empate)</div>
            <p className="leading-relaxed text-neutral-400">
              Se o jogador da vez <strong>não estiver em xeque</strong> mas <strong>não tiver nenhum movimento legal restante</strong>, a partida termina em <strong>Afogamento (Stalemate)</strong>, resultando em empate imediato (1/2 - 1/2)!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              chessAudio.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider font-chess"
          >
            Entendido, Vamos Jogar!
          </button>
        </div>
      </div>
    </div>
  );
};
