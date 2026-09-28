'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Difficulty,
  DIFFICULTIES,
  GameMode,
  ThemeId,
  THEMES,
  PlayingCard,
  PlayerStats,
  HighScoreRecord
} from '@/lib/gameData';
import { sounds } from '@/lib/audio';
import { TopBar } from './TopBar';
import { GameHUD } from './GameHUD';
import { MemoryCard } from './MemoryCard';
import { VictoryModal } from './VictoryModal';
import { StatsModal } from './StatsModal';
import { RulesModal } from './RulesModal';
import { Play, Sparkles } from 'lucide-react';

const STORAGE_KEY_RECORDS = 'jogo_memoria_records_v1';
const STORAGE_KEY_SETTINGS = 'jogo_memoria_settings_v1';

function generateShuffledDeck(targetDifficulty: Difficulty, targetTheme: ThemeId): PlayingCard[] {
  const diffConfig = DIFFICULTIES[targetDifficulty];
  const themeConfig = THEMES[targetTheme];

  const shuffledItems = [...themeConfig.items].sort(() => Math.random() - 0.5);
  const selectedItems = shuffledItems.slice(0, diffConfig.pairs);

  const deck: PlayingCard[] = [];
  selectedItems.forEach((item) => {
    deck.push({
      uniqueId: `${item.id}-1`,
      itemId: item.id,
      name: item.name,
      iconName: item.iconName,
      accentColor: item.accentColor,
      bgColor: item.bgColor,
      isFlipped: false,
      isMatched: false
    });
    deck.push({
      uniqueId: `${item.id}-2`,
      itemId: item.id,
      name: item.name,
      iconName: item.iconName,
      accentColor: item.accentColor,
      bgColor: item.bgColor,
      isFlipped: false,
      isMatched: false
    });
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export function MemoryGame() {
  // Game Setup State
  const [mode, setMode] = useState<GameMode>('classic');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [themeId, setThemeId] = useState<ThemeId>('nature');
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.isMuted === 'boolean') {
          sounds.setMuted(parsed.isMuted);
          return parsed.isMuted;
        }
      }
    } catch {
      // Safeguard
    }
    return false;
  });

  // Active Play State
  const [cards, setCards] = useState<PlayingCard[]>(() => generateShuffledDeck('medium', 'nature'));
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

  // Power ups
  const [hintsRemaining, setHintsRemaining] = useState<number>(2);
  const [canPeek, setCanPeek] = useState<boolean>(true);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);

  // 2-Player State
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [player1Stats, setPlayer1Stats] = useState<PlayerStats>({ score: 0, matches: 0, consecutiveCombos: 0 });
  const [player2Stats, setPlayer2Stats] = useState<PlayerStats>({ score: 0, matches: 0, consecutiveCombos: 0 });

  // Modals & Records
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isTimeOutLoss, setIsTimeOutLoss] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [records, setRecords] = useState<HighScoreRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedRecs = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (savedRecs) return JSON.parse(savedRecs);
    } catch {
      // Safeguard
    }
    return [];
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalPairs = DIFFICULTIES[difficulty].pairs;

  // Initialize a fresh game board
  const setupNewBoard = useCallback(
    (targetDifficulty = difficulty, targetTheme = themeId, targetMode = mode) => {
      // Clear timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const diffConfig = DIFFICULTIES[targetDifficulty];
      const deck = generateShuffledDeck(targetDifficulty, targetTheme);

      setCards(deck);
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

      // Timer reset
      if (targetMode === 'timeAttack') {
        setTimerSeconds(diffConfig.timeLimit || 60);
      } else {
        setTimerSeconds(0);
      }
      setIsTimerRunning(false);

      // 2-Player reset
      setActivePlayer(1);
      setPlayer1Stats({ score: 0, matches: 0, consecutiveCombos: 0 });
      setPlayer2Stats({ score: 0, matches: 0, consecutiveCombos: 0 });
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
              // Time's up!
              clearInterval(timerRef.current as NodeJS.Timeout);
              setIsTimerRunning(false);
              setIsTimeOutLoss(true);
              setIsVictoryModalOpen(true);
              sounds.playMismatch();
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

    // Start timer on first card flipped
    if (!isTimerRunning && !isVictoryModalOpen) {
      setIsTimerRunning(true);
    }

    sounds.playFlip();
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
          sounds.playCombo(newStreak);
        } else {
          sounds.playMatch();
        }

        // Time attack bonus
        if (mode === 'timeAttack') {
          setTimerSeconds((prev) => prev + 4);
        }

        // Two player points
        if (mode === 'twoPlayer') {
          if (activePlayer === 1) {
            setPlayer1Stats((p) => ({
              ...p,
              matches: p.matches + 1,
              score: p.score + matchPoints,
              consecutiveCombos: p.consecutiveCombos + 1
            }));
          } else {
            setPlayer2Stats((p) => ({
              ...p,
              matches: p.matches + 1,
              score: p.score + matchPoints,
              consecutiveCombos: p.consecutiveCombos + 1
            }));
          }
        }

        // Mark as matched after brief micro-delay for smooth transition
        setTimeout(() => {
          setCards((curr) =>
            curr.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setMatchedPairsCount(nextMatchedCount);
          setFlippedIndexes([]);
          setIsChecking(false);

          // Check Win Condition
          if (nextMatchedCount === totalPairs) {
            handleVictory(nextMoves, timerSeconds);
          }
        }, 300);
      } else {
        // MISMATCH
        sounds.playMismatch();
        setComboStreak(0);

        setTimeout(() => {
          setCards((curr) =>
            curr.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndexes([]);
          setIsChecking(false);

          // Pass turn in 2-player
          if (mode === 'twoPlayer') {
            setActivePlayer((prev) => (prev === 1 ? 2 : 1));
          }
        }, 900);
      }
    }
  };

  // Handle victory completion
  const handleVictory = (finalMoves: number, finalTime: number) => {
    setIsTimerRunning(false);
    sounds.playVictory();

    // Compute star rating
    const basePairs = totalPairs;
    let starsEarned = 1;
    if (finalMoves <= Math.round(basePairs * 1.5)) {
      starsEarned = 3;
    } else if (finalMoves <= Math.round(basePairs * 2.3)) {
      starsEarned = 2;
    }

    const accuracy = totalFlipsCount > 0 ? Math.min(100, Math.round(((totalPairs * 2) / (finalMoves * 2)) * 100)) : 100;

    // Save record to local storage
    const newRecord: HighScoreRecord = {
      date: new Date().toLocaleDateString('pt-BR'),
      mode,
      difficulty,
      theme: themeId,
      moves: finalMoves,
      timeSeconds: finalTime,
      stars: starsEarned,
      accuracy
    };

    try {
      const updated = [newRecord, ...records];
      setRecords(updated);
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
    } catch {
      // LocalStorage safeguard
    }

    setIsVictoryModalOpen(true);
  };

  // Hint Power-Up: Highlight one unmatched pair
  const handleUseHint = () => {
    if (hintsRemaining <= 0 || isChecking || isPaused) return;

    // Find unmatched items
    const unmatchedCards = cards.filter((c) => !c.isMatched);
    if (unmatchedCards.length < 2) return;

    const targetItemId = unmatchedCards[0].itemId;

    setHintsRemaining((h) => h - 1);
    sounds.playHint();

    setCards((curr) =>
      curr.map((c) => (c.itemId === targetItemId ? { ...c, isHinted: true } : c))
    );

    // Remove hint glow after 1.5s
    setTimeout(() => {
      setCards((curr) => curr.map((c) => ({ ...c, isHinted: false })));
    }, 1500);
  };

  // Peek Power-Up: Reveal board briefly
  const handleUsePeek = () => {
    if (!canPeek || isChecking || isPaused) return;

    setCanPeek(false);
    setIsPeeking(true);
    sounds.playHint();

    setCards((curr) => curr.map((c) => ({ ...c, isFlipped: true })));

    setTimeout(() => {
      setCards((curr) =>
        curr.map((c) => (c.isMatched ? c : { ...c, isFlipped: false }))
      );
      setIsPeeking(false);
    }, 1600);
  };

  // Sound Toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({ isMuted: nextMuted }));
    } catch {
      // LocalStorage safeguard
    }
  };

  // Clear Records
  const handleClearRecords = () => {
    setRecords([]);
    try {
      localStorage.removeItem(STORAGE_KEY_RECORDS);
    } catch {
      // Safeguard
    }
  };

  const calculatedAccuracy = moves > 0 ? Math.min(100, Math.round(((matchedPairsCount * 2) / (moves * 2)) * 100)) : 100;
  const currentDiffConfig = DIFFICULTIES[difficulty];

  // Grid column styling based on difficulty
  const gridColsClass =
    difficulty === 'easy'
      ? 'grid-cols-3 sm:grid-cols-4 max-w-2xl'
      : difficulty === 'medium'
      ? 'grid-cols-4 max-w-2xl'
      : difficulty === 'hard'
      ? 'grid-cols-4 sm:grid-cols-5 max-w-3xl'
      : 'grid-cols-4 sm:grid-cols-6 max-w-4xl';

  return (
    <div className="min-h-screen bg-slate-950 bg-game-felt text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract (3 zones) */}
      <TopBar
        currentMode={mode}
        onSelectMode={(m) => {
          setMode(m);
          setupNewBoard(difficulty, themeId, m);
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onRestart={() => setupNewBoard()}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenRules={() => setIsRulesModalOpen(true)}
      />

      {/* Main Game Arena Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-start space-y-6">
        
        {/* HUD & Control Bar */}
        <GameHUD
          mode={mode}
          difficulty={difficulty}
          onChangeDifficulty={(d) => {
            setDifficulty(d);
            setupNewBoard(d, themeId, mode);
          }}
          themeId={themeId}
          onChangeTheme={(t) => {
            setThemeId(t);
            setupNewBoard(difficulty, t, mode);
          }}
          moves={moves}
          matchedPairsCount={matchedPairsCount}
          totalPairs={totalPairs}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          onTogglePause={() => setIsPaused((p) => !p)}
          isPaused={isPaused}
          comboStreak={comboStreak}
          score={score}
          activePlayer={activePlayer}
          player1Stats={player1Stats}
          player2Stats={player2Stats}
          hintsRemaining={hintsRemaining}
          onUseHint={handleUseHint}
          canPeek={canPeek}
          onUsePeek={handleUsePeek}
          disabledControls={isChecking || isPeeking}
        />

        {/* Board Playing Field */}
        <section
          aria-label="Tabuleiro de cartas do jogo da memória"
          className="relative w-full flex flex-col items-center justify-center min-h-[420px]"
        >
          {/* Pause Overlay */}
          {isPaused && (
            <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Play className="w-8 h-8 ml-1" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Jogo Pausado</h3>
                <p className="text-xs text-slate-400 mt-1">O cronômetro está parado. Respire e retome quando estiver pronto.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPaused(false)}
                className="py-2.5 px-6 rounded-xl bg-amber-400 text-slate-950 font-semibold text-xs hover:bg-amber-300 transition-all shadow-md"
              >
                Continuar Jogo
              </button>
            </div>
          )}

          {/* Cards Grid */}
          <div className={`grid ${gridColsClass} gap-2.5 sm:gap-3.5 w-full mx-auto justify-center`}>
            {cards.map((card, idx) => (
              <MemoryCard
                key={card.uniqueId}
                card={card}
                themeId={themeId}
                index={idx}
                isDisabled={isChecking || isPaused || isPeeking}
                onFlip={handleFlipCard}
              />
            ))}
          </div>
        </section>

        {/* Quiet Footer Note with Clean Metadata */}
        <footer className="w-full pt-8 pb-4 text-center border-t border-white/5">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>Jogo da Memória</span>
            <span aria-hidden="true">·</span>
            <span>{currentDiffConfig.label} ({totalPairs} pares)</span>
            <span aria-hidden="true">·</span>
            <span>{THEMES[themeId].label}</span>
          </div>
        </footer>
      </main>

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        onRestart={() => setupNewBoard()}
        mode={mode}
        difficulty={difficulty}
        moves={moves}
        timeSeconds={timerSeconds}
        stars={moves <= Math.round(totalPairs * 1.5) ? 3 : moves <= Math.round(totalPairs * 2.3) ? 2 : 1}
        accuracy={calculatedAccuracy}
        maxCombo={maxCombo}
        score={score}
        player1Matches={player1Stats.matches}
        player2Matches={player2Stats.matches}
        isTimeOutLoss={isTimeOutLoss}
      />

      {/* Stats Modal */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        records={records}
        onClearRecords={handleClearRecords}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
