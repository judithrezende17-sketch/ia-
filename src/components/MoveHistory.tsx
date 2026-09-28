import React, { useRef, useEffect, useState } from 'react';
import { MoveRecord } from '../types';
import { ScrollText, Copy, Check, FileText } from 'lucide-react';
import { chessAudio } from '../audio';

interface MoveHistoryProps {
  history: MoveRecord[];
  pgn: string;
  fen: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history, pgn, fen }) => {
  const [copiedType, setCopiedType] = useState<'pgn' | 'fen' | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of move list
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCopy = (type: 'pgn' | 'fen', text: string) => {
    chessAudio.playClick();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  // Group moves in pairs (White, Black)
  const movePairs: { num: number; white: MoveRecord; black?: MoveRecord }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1]
    });
  }

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-3 sm:p-4 flex flex-col justify-between space-y-3 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-chess">
            Histórico de Lances
          </h3>
        </div>
        <span className="text-[11px] text-neutral-400 font-mono">
          {history.length} lances
        </span>
      </div>

      {/* Move List Body */}
      <div
        ref={scrollRef}
        className="h-32 sm:h-44 overflow-y-auto space-y-1 pr-1 font-mono text-xs divide-y divide-neutral-800/40"
      >
        {movePairs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-500 text-xs italic">
            Nenhum lance efetuado ainda.
          </div>
        ) : (
          movePairs.map((pair) => (
            <div
              key={pair.num}
              className="grid grid-cols-12 py-1 items-center hover:bg-neutral-800/40 rounded px-1.5 transition-colors"
            >
              <span className="col-span-3 text-neutral-500 text-[11px]">{pair.num}.</span>
              <span className="col-span-4 text-neutral-200 font-semibold">{pair.white.san}</span>
              <span className="col-span-5 text-neutral-400 font-semibold">{pair.black?.san || '...'}</span>
            </div>
          ))
        )}
      </div>

      {/* Footer Copy FEN / PGN Actions */}
      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handleCopy('pgn', pgn)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white transition-colors border border-neutral-700"
        >
          {copiedType === 'pgn' ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copiedType === 'pgn' ? 'PGN Copiado!' : 'Copiar PGN'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleCopy('fen', fen)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white transition-colors border border-neutral-700"
        >
          {copiedType === 'fen' ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
          <span>{copiedType === 'fen' ? 'FEN Copiado!' : 'Copiar FEN'}</span>
        </button>
      </div>
    </div>
  );
};
