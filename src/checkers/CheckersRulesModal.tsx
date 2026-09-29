'use client';

import React from 'react';
import { X, Crown, Swords, ShieldCheck, Zap, BookOpen } from 'lucide-react';

interface CheckersRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckersRulesModal: React.FC<CheckersRulesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 text-neutral-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold font-chess text-amber-300">
              Regras Oficiais do Jogo de Damas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
          {/* 1. Objetivo */}
          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Swords className="w-4 h-4 text-amber-400" />
              <span>1. Objetivo da Partida</span>
            </div>
            <p className="text-neutral-300 text-xs">
              Capturar todas as peças do adversário ou imobilizá-las (bloqueio total), impedindo que o oponente realize qualquer lance legal.
            </p>
          </div>

          {/* 2. Movimento Comum */}
          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>2. Movimentação das Peças Comuns</span>
            </div>
            <p className="text-neutral-300 text-xs">
              O jogo é disputado nas 32 casas escuras do tabuleiro 8x8. Em lances simples (sem captura), as peças comuns movem-se <strong>1 casa na diagonal para frente</strong> em direção ao campo adversário.
            </p>
          </div>

          {/* 3. Captura & Lei da Maioria */}
          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>3. Captura Obrigatória e Lei da Maioria</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-xs">
              <li>
                <strong>Captura Obrigatória:</strong> Sempre que houver oportunidade de captura, ela deve ser executada obrigatoriamente.
              </li>
              <li>
                <strong>Captura para Trás (Regra Brasileira):</strong> Peças comuns capturam tanto para frente quanto para trás quando houver uma peça inimiga adjacente e a casa posterior estiver livre.
              </li>
              <li>
                <strong>Captura em Cadeia:</strong> Se após o salto a mesma peça puder capturar novamente, o movimento continua na mesma jogada até esgotar os saltos.
              </li>
              <li>
                <strong>Lei da Maioria:</strong> Se existirem duas ou mais opções de captura, é estritamente obrigatório escolher a linha que capture o <strong>maior número de peças</strong>.
              </li>
            </ul>
          </div>

          {/* 4. A Dama (Coroação) */}
          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>4. Coroação e a Dama Voadora</span>
            </div>
            <p className="text-neutral-300 text-xs">
              Ao atingir a última linha do campo oposto (linha 8 para Brancas, linha 1 para Pretas), a peça é promovida a <strong>Dama</strong>.
            </p>
            <p className="text-neutral-300 text-xs">
              Na <strong>Regra Brasileira Oficial</strong>, a Dama é de longo alcance (&quot;voadora&quot;): ela pode mover-se qualquer número de casas livres ao longo das quatro diagonais e saltar sobre peças adversárias a qualquer distância, pousando em qualquer casa vazia posterior.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider font-chess transition-colors cursor-pointer"
          >
            Entendido, Vamos Jogar!
          </button>
        </div>
      </div>
    </div>
  );
};
