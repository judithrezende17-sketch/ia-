'use client';

import React from 'react';
import { HighScoreRecord, DIFFICULTIES } from '@/lib/gameData';
import { X, Trophy, Trash2, Award, Clock, Zap, Star } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: HighScoreRecord[];
  onClearRecords: () => void;
}

export function StatsModal({
  isOpen,
  onClose,
  records,
  onClearRecords
}: StatsModalProps) {
  if (!isOpen) return null;

  // Compute best scores per difficulty
  const bestByDiff = ['easy', 'medium', 'hard', 'expert'].map((dKey) => {
    const diffRecords = records.filter((r) => r.difficulty === dKey);
    if (diffRecords.length === 0) return null;

    const minMoves = Math.min(...diffRecords.map((r) => r.moves));
    const minTime = Math.min(...diffRecords.map((r) => r.timeSeconds));

    return {
      difficulty: dKey,
      label: DIFFICULTIES[dKey as keyof typeof DIFFICULTIES].label,
      minMoves,
      minTime,
      count: diffRecords.length
    };
  }).filter(Boolean);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col space-y-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Recordes & Estatísticas</h2>
              <p className="text-xs text-slate-400">Seu histórico de conquistas salvo localmente</p>
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

        {/* Scrollable Body */}
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Section 1: Melhores Marcas */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Melhores Desempenhos
            </h3>
            {bestByDiff.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-950/40 border border-white/5 text-slate-400 text-xs">
                Nenhuma partida registrada ainda. Jogue uma rodada para registrar seu primeiro recorde!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {bestByDiff.map((b) => b && (
                  <div
                    key={b.difficulty}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-400">{b.label}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{b.count} partida(s)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> Melhor Tempo:
                      </span>
                      <span className="font-mono font-semibold text-white">{formatTime(b.minTime)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Zap className="w-3.5 h-3.5" /> Menos Jogadas:
                      </span>
                      <span className="font-mono font-semibold text-white">{b.minMoves} jogadas</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Histórico Recente */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Histórico Recente (Últimas Partidas)
              </h3>
              {records.length > 0 && (
                <button
                  type="button"
                  onClick={onClearRecords}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar Histórico</span>
                </button>
              )}
            </div>

            {records.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs">
                Sem registros anteriores.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-medium border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Data</th>
                      <th className="py-2.5 px-3">Modo</th>
                      <th className="py-2.5 px-3">Nível</th>
                      <th className="py-2.5 px-3 text-right">Tempo</th>
                      <th className="py-2.5 px-3 text-right">Jogadas</th>
                      <th className="py-2.5 px-3 text-right">Estrelas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {records.slice(0, 10).map((r, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-slate-400 text-[11px] font-sans whitespace-nowrap">
                          {r.date}
                        </td>
                        <td className="py-2 px-3 text-slate-200 font-sans whitespace-nowrap capitalize">
                          {r.mode === 'classic' ? 'Solo' : r.mode === 'timeAttack' ? 'Tempo' : '2J'}
                        </td>
                        <td className="py-2 px-3 text-slate-300 font-sans whitespace-nowrap">
                          {DIFFICULTIES[r.difficulty]?.label || r.difficulty}
                        </td>
                        <td className="py-2 px-3 text-right text-white tabular-nums">
                          {formatTime(r.timeSeconds)}
                        </td>
                        <td className="py-2 px-3 text-right text-white tabular-nums">
                          {r.moves}
                        </td>
                        <td className="py-2 px-3 text-right text-amber-400">
                          {'★'.repeat(r.stars)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
