'use client';

import React from 'react';
import { X, HelpCircle, Sparkles, Brain, Clock, Users, Keyboard } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col space-y-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Como Jogar & Regras</h2>
              <p className="text-xs text-slate-400">Guia completo para exercitar sua mente</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto pr-1 text-xs text-slate-300">
          {/* Card 1: Objetivo Principal */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white text-sm">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span>Objetivo do Jogo</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Encontre todos os pares de cartas idênticas virando duas cartas por vez. Se as duas cartas reveladas forem iguais, elas permanecem abertas. Caso sejam diferentes, voltam a se fechar e você continua tentando.
            </p>
          </div>

          {/* Card 2: Modos de Jogo */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3">
            <div className="font-semibold text-white text-sm">Modos Disponíveis</div>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Solo Clássico:</strong> Jogue no seu próprio ritmo. Seu objetivo é concluir no menor tempo e com o menor número possível de jogadas para alcançar 3 estrelas.
                </div>
              </div>

              <div className="flex gap-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Contra o Tempo:</strong> O relógio corre contra você! Cada par correto concede segundos bônus (+4 segundos). Conclua antes que o cronômetro chegue a zero.
                </div>
              </div>

              <div className="flex gap-2">
                <Users className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">2 Jogadores (Pass & Play):</strong> Desafie um amigo no mesmo aparelho! Ao acertar um par, o jogador ganha pontos e joga novamente. Quem acumular mais pares vence a partida.
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Combos & Recursos */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="font-semibold text-white text-sm">Recursos & Combos</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Combos em Série:</strong> Acertar pares consecutivamente multiplica sua pontuação e toca acordes crescentes.</li>
              <li><strong className="text-slate-200">Dica (Revelar Par):</strong> Destaca temporariamente um par não descoberto para ajudar nos momentos difíceis.</li>
              <li><strong className="text-slate-200">Espiar Tabuleiro:</strong> Vira rapidamente as cartas para memorização relâmpago.</li>
            </ul>
          </div>

          {/* Card 4: Acessibilidade Teclado */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white text-sm">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <span>Controle pelo Teclado</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Você pode navegar entre as cartas usando a tecla <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Tab</kbd> ou <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Shift+Tab</kbd>, e virar a carta selecionada pressionando <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Enter</kbd> ou <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Espaço</kbd>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors"
          >
            Entendido, Vamos Jogar!
          </button>
        </div>
      </div>
    </div>
  );
}
