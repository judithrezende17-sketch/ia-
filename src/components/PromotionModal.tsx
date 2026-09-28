import React from 'react';
import { Color, PieceSymbol } from 'chess.js';
import { ChessPiece } from './ChessPiece';
import { chessAudio } from '../audio';

interface PromotionModalProps {
  isOpen: boolean;
  color: Color;
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ isOpen, color, onSelect }) => {
  if (!isOpen) return null;

  const choices: { type: 'q' | 'r' | 'b' | 'n'; label: string }[] = [
    { type: 'q', label: 'Dama (Rainha)' },
    { type: 'r', label: 'Torre' },
    { type: 'b', label: 'Bispo' },
    { type: 'n', label: 'Cavalo' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-neutral-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4 max-w-sm w-full">
        <h3 className="text-lg font-bold text-white font-chess">
          Promoção de Peão
        </h3>
        <p className="text-xs text-neutral-400">
          Escolha a nova peça para substituir o seu peão que chegou ao fim do tabuleiro:
        </p>

        <div className="grid grid-cols-4 gap-2 pt-2">
          {choices.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                chessAudio.playClick();
                onSelect(type);
              }}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-800 hover:bg-amber-500/20 hover:border-amber-400 border border-neutral-700 transition-all hover:scale-105 active:scale-95 group"
            >
              <div className="w-12 h-12">
                <ChessPiece type={type} color={color} />
              </div>
              <span className="text-[11px] font-medium text-neutral-300 group-hover:text-amber-300 mt-1">
                {label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
