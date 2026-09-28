import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MemoryDifficulty,
  MEMORY_DIFFICULTIES,
  MemoryGameMode,
  MemoryThemeId,
  MEMORY_THEMES,
  MemoryPlayingCard,
  MemoryScoreRecord
} from './memoryData';
import { chessAudio } from '../audio';
import {
  RotateCcw,
  Sparkles,
  Eye,
  Trophy,
  Flame,
  Clock,
  Target,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Star,
  Users,
  CheckCircle2
} from 'lucide-react';

const STORAGE_KEY_MEMORY_RECORDS = 'memory_game_records_v2';

function generateDeck(difficulty: MemoryDifficulty, themeId: MemoryThemeId): MemoryPlayingCard[] {
  const diffConfig = MEMORY_DIFFICULTIES[difficulty];
  const theme = MEMORY_THEMES[themeId];

  const shuffledItems = [...theme.items].sort(() => Math.random() - 0.5);
  const selectedItems = shuffledItems.slice(0, diffConfig.pairs);

  const deck: MemoryPlayingCard[] = [];
  selectedItems.forEach((item) => {
    deck.push({
      uniqueId: `${item.id}-1`,
      itemId: item.id,
      name: item.name,
      emoji: item.emoji,
      accentColor: item.accentColor,
      bgColor: item.bgColor,
      isFlipped: false,
      isMatched: false
    });
    deck.push({
      uniqueId: `${item.id}-2`,
      itemId: item.id,
      name: item.name,
      emoji: item.emoji,
      accentColor: item.accentColor,
      bgColor: item.bgColor,
      isFlipped: false,
      isMatched: false
    });
  });

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export const MemoryGame: React.FC = () => {
  // Game Setup
  const [mode, setMode] = useState<MemoryGameMode>('classic');
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>('medium');
  const [themeId, setThemeId] = useState<MemoryThemeId>('chess');
  const [isMuted, setIsMuted] = useState<boolean>(() => chessAudio.getMuted());

  // Active Play State
  const [cards, setCards] = useState<MemoryPlayingCard[]>(() => generateDeck('medium', 'chess'));
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [totalFlipsCount, setTotalFlipsCount] = useState<number>(0);

  // Timer & Scores
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // Power-ups
  const [hintsRemaining, setHintsRemaining] = useState<number>(2);
  const [canPeek, setCanPeek] = useState<boolean>(true);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);

  // 2-Player Pass & Play
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [player1Matches, setPlayer1Matches] = useState<number>(0);
  const [player2Matches, setPlayer2Matches] = useState<number>(0);

  // Modals & Records
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isTimeOutLoss, setIsTimeOutLoss] = useState<boolean>(false);
  const [records, setRecords] = useState<MemoryScoreRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEMORY_RECORDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalPairs = MEMORY_DIFFICULTIES[difficulty].pairs;

  // Reset / Setup new board
  const setupNewGame = useCallback(
    (targetDifficulty = difficulty, targetTheme = themeId, targetMode = mode) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const diffConfig = MEMORY_DIFFICULTIES[targetDifficulty];
      const newDeck = generateDeck(targetDifficulty, targetTheme);

      setCards(newDeck);
      setFlippedIndexes([]);
      setIsChecking(false);
      setMoves(0);
      setTotalFlipsCount(0);
      setMatchedPairsCount(0);
      setComboStreak(0);
      setMaxCombo(0);
      setScore(0);
      setHintsRemaining(2);
      setCanPeek(true);
      setIsPeeking(false);
      setIsPaused(false);
      setIsVictoryModalOpen(false);
      setIsTimeOutLoss(false);

      if (targetMode === 'timeAttack') {
        setTimerSeconds(diffConfig.timeLimit || 60);
      } else {
        setTimerSeconds(0);
      }
      setIsTimerRunning(false);

      setActivePlayer(1);
      setPlayer1Matches(0);
      setPlayer2Matches(0);
    },
    [difficulty, themeId, mode]
  );

  // Timer loop
  useEffect(() => {
    if (isTimerRunning && !isPaused && !isVictoryModalOpen) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (mode === 'timeAttack') {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              setIsTimerRunning(false);
              setIsTimeOutLoss(true);
              setIsVictoryModalOpen(true);
              chessAudio.playMismatch();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerRunning, isPaused, isVictoryModalOpen, mode]);

  // Card Flip Handler
  const handleFlipCard = (index: number) => {
    if (isChecking || isPaused || isPeeking || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    if (!isTimerRunning && !isVictoryModalOpen) {
      setIsTimerRunning(true);
    }

    chessAudio.playFlip();
    setTotalFlipsCount((c) => c + 1);

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true, isHinted: false };
    setCards(newCards);

    const newFlipped = [...flippedIndexes, index];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.itemId === secondCard.itemId) {
        // MATCH!
        const nextMatchedCount = matchedPairsCount + 1;
        const newStreak = comboStreak + 1;
        const matchPoints = 100 + newStreak * 50;

        setComboStreak(newStreak);
        setMaxCombo((prev) => Math.max(prev, newStreak));
        setScore((prev) => prev + matchPoints);

        if (newStreak > 1) {
          chessAudio.playCombo(newStreak);
        } else {
          chessAudio.playMatch();
        }

        if (mode === 'timeAttack') {
          setTimerSeconds((prev) => prev + 4);
        }

        if (mode === 'twoPlayer') {
          if (activePlayer === 1) {
            setPlayer1Matches((p) => p + 1);
          } else {
            setPlayer2Matches((p) => p + 1);
          }
        }

        setTimeout(() => {
          setCards((curr) =>
            curr.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setMatchedPairsCount(nextMatchedCount);
          setFlippedIndexes([]);
          setIsChecking(false);

          if (nextMatchedCount === totalPairs) {
            handleVictory(nextMoves, timerSeconds);
          }
        }, 300);
      } else {
        // MISMATCH
        chessAudio.playMismatch();
        setComboStreak(0);

        setTimeout(() => {
          setCards((curr) =>
            curr.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndexes([]);
          setIsChecking(false);

          if (mode === 'twoPlayer') {
            setActivePlayer((prev) => (prev === 1 ? 2 : 1));
          }
        }, 900);
      }
    }
  };

  // Victory Handler
  const handleVictory = (finalMoves: number, finalTime: number) => {
    setIsTimerRunning(false);
    chessAudio.playVictory();

    let stars = 1;
    if (finalMoves <= Math.round(totalPairs * 1.4)) {
      stars = 3;
    } else if (finalMoves <= Math.round(totalPairs * 2.1)) {
      stars = 2;
    }

    const accuracy =
      totalFlipsCount > 0 ? Math.min(100, Math.round(((totalPairs * 2) / (finalMoves * 2)) * 100)) : 100;

    const newRecord: MemoryScoreRecord = {
      date: new Date().toLocaleDateString('pt-BR'),
      mode,
      difficulty,
      theme: themeId,
      moves: finalMoves,
      timeSeconds: finalTime,
      stars,
      accuracy
    };

    try {
      const updated = [newRecord, ...records];
      setRecords(updated);
      localStorage.setItem(STORAGE_KEY_MEMORY_RECORDS, JSON.stringify(updated));
    } catch {}

    setIsVictoryModalOpen(true);
  };

  // Power-up Hint
  const handleUseHint = () => {
    if (hintsRemaining <= 0 || isChecking || isPaused) return;

    const unmatched = cards.filter((c) => !c.isMatched);
    if (unmatched.length < 2) return;

    const targetId = unmatched[0].itemId;

    setHintsRemaining((h) => h - 1);
    chessAudio.playHint();

    setCards((curr) =>
      curr.map((c) => (c.itemId === targetId ? { ...c, isHinted: true } : c))
    );

    setTimeout(() => {
      setCards((curr) => curr.map((c) => ({ ...c, isHinted: false })));
    }, 1500);
  };

  // Power-up Peek
  const handleUsePeek = () => {
    if (!canPeek || isChecking || isPaused) return;

    setCanPeek(false);
    setIsPeeking(true);
    chessAudio.playHint();

    setCards((curr) => curr.map((c) => ({ ...c, isFlipped: true })));

    setTimeout(() => {
      setCards((curr) =>
        curr.map((c) => (c.isMatched ? c : { ...c, isFlipped: false }))
      );
      setIsPeeking(false);
    }, 1600);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    chessAudio.setMuted(next);
  };

  const currentTheme = MEMORY_THEMES[themeId];
  const currentDiff = MEMORY_DIFFICULTIES[difficulty];

  return (
    <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in duration-300">
      
      {/* HUD Header Bar */}
      <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl p-3 sm:p-4 shadow-xl space-y-3.5">
        
        {/* Row 1: Mode Switcher & Game Status */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Modes */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                chessAudio.playClick();
                setMode('classic');
                setupNewGame(difficulty, themeId, 'classic');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'classic'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Clássico
            </button>

            <button
              type="button"
              onClick={() => {
                chessAudio.playClick();
                setMode('timeAttack');
                setupNewGame(difficulty, themeId, 'timeAttack');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'timeAttack'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Contra o Tempo
            </button>

            <button
              type="button"
              onClick={() => {
                chessAudio.playClick();
                setMode('twoPlayer');
                setupNewGame(difficulty, themeId, 'twoPlayer');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'twoPlayer'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              2 Jogadores
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              title={isPaused ? 'Continuar' : 'Pausar'}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              title={isMuted ? 'Ativar Sons' : 'Silenciar'}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => {
                chessAudio.playClick();
                setupNewGame();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Row 2: Live Metrics Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Card 1: Time */}
          <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Tempo</span>
              <span className="text-base sm:text-lg font-bold font-mono text-white">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>

          {/* Card 2: Moves & Pairs */}
          <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Lances / Pares</span>
              <span className="text-base sm:text-lg font-bold font-mono text-white">
                {moves} <span className="text-xs text-neutral-500 font-sans">({matchedPairsCount}/{totalPairs})</span>
              </span>
            </div>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Card 3: Streak / Combo */}
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
              comboStreak >= 2
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-md shadow-rose-950/30'
                : 'bg-neutral-950/70 border-neutral-800'
            }`}
          >
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Sequência</span>
              <span className="text-base sm:text-lg font-bold font-mono text-orange-400 flex items-center gap-1">
                {comboStreak}x
                {comboStreak >= 2 && <span className="text-[10px] text-rose-400 uppercase font-bold animate-pulse">Combo!</span>}
              </span>
            </div>
            <Flame className={`w-4 h-4 ${comboStreak >= 2 ? 'text-rose-500 animate-bounce' : 'text-neutral-500'}`} />
          </div>

          {/* Card 4: Power-Ups (Hint & Peek) */}
          <div className="p-2 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-around">
            <button
              type="button"
              onClick={handleUseHint}
              disabled={hintsRemaining <= 0 || isChecking || isPaused}
              title="Dica: Revela 1 par não encontrado por 1.5s"
              className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-amber-400"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold mt-0.5">Dica ({hintsRemaining})</span>
            </button>

            <div className="w-px h-6 bg-neutral-800" />

            <button
              type="button"
              onClick={handleUsePeek}
              disabled={!canPeek || isChecking || isPaused}
              title="Espiar: Mostra todo o tabuleiro por 1.6s"
              className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sky-400"
            >
              <Eye className="w-4 h-4" />
              <span className="text-[10px] font-bold mt-0.5">Espiar {canPeek ? '(1)' : '(0)'}</span>
            </button>
          </div>
        </div>

        {/* 2-Player Turn Banner (if in two-player mode) */}
        {mode === 'twoPlayer' && (
          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-2 ${activePlayer === 1 ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}>
              <Users className="w-4 h-4" />
              <span>Jogador 1: {player1Matches} pares</span>
              {activePlayer === 1 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
            </div>

            <div className={`flex items-center gap-2 ${activePlayer === 2 ? 'text-sky-400 font-bold' : 'text-neutral-400'}`}>
              <span>Jogador 2: {player2Matches} pares</span>
              <Users className="w-4 h-4" />
              {activePlayer === 2 && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
            </div>
          </div>
        )}

        {/* Row 3: Theme and Difficulty Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800 text-xs">
          {/* Difficulty */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-neutral-400 font-medium">Dificuldade:</span>
            {(['easy', 'medium', 'hard', 'master'] as MemoryDifficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  chessAudio.playClick();
                  setDifficulty(d);
                  setupNewGame(d, themeId, mode);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  difficulty === d
                    ? 'bg-neutral-700 text-white ring-2 ring-amber-400 shadow-sm'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {d === 'easy' ? 'Fácil (12)' : d === 'medium' ? 'Médio (16)' : d === 'hard' ? 'Difícil (20)' : 'Mestre (24)'}
              </button>
            ))}
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-neutral-400 font-medium">Tema:</span>
            {(['chess', 'animals', 'cosmos', 'food', 'tech'] as MemoryThemeId[]).map((tId) => {
              const th = MEMORY_THEMES[tId];
              return (
                <button
                  key={tId}
                  type="button"
                  onClick={() => {
                    chessAudio.playClick();
                    setThemeId(tId);
                    setupNewGame(difficulty, tId, mode);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    themeId === tId
                      ? 'bg-neutral-700 text-white ring-2 ring-amber-400 shadow-sm'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{th.icon}</span>
                  <span>{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Playing Field: Memory Cards Grid */}
      <div className="relative w-full max-w-4xl flex items-center justify-center min-h-[400px]">
        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-30 bg-neutral-950/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3">
            <h3 className="text-xl font-bold text-white font-chess">Jogo Pausado</h3>
            <p className="text-xs text-neutral-400">O cronômetro está parado. Retome quando desejar.</p>
            <button
              type="button"
              onClick={() => setIsPaused(false)}
              className="py-2.5 px-6 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-chess hover:bg-amber-300 transition-all shadow-md"
            >
              Continuar Jogo
            </button>
          </div>
        )}

        {/* Cards Grid */}
        <div className={`grid ${currentDiff.gridCols} gap-2.5 sm:gap-3.5 w-full mx-auto justify-center`}>
          {cards.map((card, idx) => {
            const isCardActive = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.uniqueId}
                type="button"
                onClick={() => handleFlipCard(idx)}
                disabled={isChecking || isPaused || isPeeking || card.isMatched || card.isFlipped}
                className={`relative aspect-[3/4] w-full rounded-2xl cursor-pointer transition-all duration-300 [perspective:1000px] outline-none group ${
                  card.isMatched ? 'opacity-80 scale-95' : 'hover:scale-105 active:scale-95'
                } ${card.isHinted ? 'ring-4 ring-amber-400 animate-pulse' : ''}`}
              >
                {/* 3D Inner Card Container */}
                <div
                  className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] rounded-2xl shadow-xl ${
                    isCardActive ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* CARD BACK (Unflipped) */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${currentTheme.cardBackGradient} border-2 flex flex-col items-center justify-center p-2 [backface-visibility:hidden]`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                      {currentTheme.icon}
                    </div>
                    <span className="text-[10px] font-bold text-amber-200/50 mt-1 uppercase tracking-widest font-chess">
                      Memória
                    </span>
                  </div>

                  {/* CARD FRONT (Flipped / Revealed) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl border-2 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-between p-2 shadow-2xl transition-colors"
                    style={{
                      backgroundColor: card.bgColor,
                      borderColor: card.isMatched ? '#10b981' : card.accentColor
                    }}
                  >
                    <div className="w-full flex justify-end">
                      {card.isMatched && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-in zoom-in-50" />
                      )}
                    </div>

                    {/* Emoji / Symbol */}
                    <div className="text-3xl sm:text-4xl filter drop-shadow-md my-auto">
                      {card.emoji}
                    </div>

                    {/* Card Label */}
                    <span className="text-[10px] font-semibold text-white/90 text-center truncate w-full px-1">
                      {card.name}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {isVictoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-5">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-chess uppercase">
                {isTimeOutLoss ? 'Tempo Esgotado!' : mode === 'twoPlayer' ? 'Fim da Partida!' : 'Parabéns! Vitória!'}
              </h2>
              <p className="text-xs text-neutral-400">
                {isTimeOutLoss
                  ? 'O cronômetro chegou ao fim antes de todos os pares serem encontrados.'
                  : mode === 'twoPlayer'
                  ? player1Matches > player2Matches
                    ? 'Jogador 1 venceu a disputa!'
                    : player2Matches > player1Matches
                    ? 'Jogador 2 venceu a disputa!'
                    : 'A partida terminou em empate!'
                  : 'Você encontrou todos os pares de cartas do jogo da memória!'}
              </p>
            </div>

            {/* Stars Rating (for classic solo) */}
            {!isTimeOutLoss && mode !== 'twoPlayer' && (
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3].map((star) => {
                  const earned = moves <= Math.round(totalPairs * 1.4) ? 3 : moves <= Math.round(totalPairs * 2.1) ? 2 : 1;
                  return (
                    <Star
                      key={star}
                      className={`w-7 h-7 ${
                        star <= earned
                          ? 'text-amber-400 fill-amber-400 drop-shadow'
                          : 'text-neutral-700 fill-neutral-800'
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left text-xs">
              <div>
                <span className="text-neutral-500 block">Movimentos</span>
                <span className="text-lg font-bold font-mono text-white">{moves} jogadas</span>
              </div>

              <div>
                <span className="text-neutral-500 block">Tempo Total</span>
                <span className="text-lg font-bold font-mono text-amber-400">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 block">Maior Combo</span>
                <span className="text-base font-bold font-mono text-orange-400">{maxCombo} seguidos</span>
              </div>

              <div>
                <span className="text-neutral-500 block">Pontuação</span>
                <span className="text-base font-bold font-mono text-emerald-400">{score} pts</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setupNewGame()}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl transition-all shadow-lg shadow-amber-400/20 font-chess uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jogar Novamente</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
