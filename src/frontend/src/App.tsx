import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ScrollText, Trophy, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { Board } from "./components/Board";
import { Dice } from "./components/Dice";
import { FooterLinks } from "./components/FooterLinks";
import { GameSetup } from "./components/GameSetup";
import { LoginModal } from "./components/LoginModal";
import { MoveLog } from "./components/MoveLog";
import { Scoreboard } from "./components/Scoreboard";
import { SignUpModal } from "./components/SignUpModal";
import { WinModal } from "./components/WinModal";
import { useRecordWin } from "./hooks/useQueries";
import { COLORS_ORDER, LADDERS, PLAYER_COLORS, SNAKES } from "./types/game";
import type {
  GamePhase,
  MoveLogEntry,
  Player,
  PlayerColor,
} from "./types/game";
import {
  isMuted,
  playDiceRoll,
  playLadder,
  playSnake,
  playWin,
  setMuted,
} from "./utils/sounds";

const queryClient = new QueryClient();

function AppInner() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]);
  const [highlightSquare, setHighlightSquare] = useState<number | null>(null);
  const [muted, setMutedState] = useState(false);
  const [activeSnake, setActiveSnake] = useState<number | null>(null);
  const [activeLadder, setActiveLadder] = useState<number | null>(null);

  const recordWin = useRecordWin();
  const animatingRef = useRef(false);

  const handleMuteToggle = useCallback(() => {
    const next = !isMuted();
    setMuted(next);
    setMutedState(next);
  }, []);

  const handleStart = useCallback((playerNames: string[]) => {
    const newPlayers: Player[] = playerNames.map((name, i) => ({
      id: i,
      name,
      color: COLORS_ORDER[i] as PlayerColor,
      position: 0,
    }));
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setMoveLog([]);
    setWinner(null);
    setPhase("playing");
  }, []);

  const addMoveLogEntry = useCallback((entry: MoveLogEntry) => {
    setMoveLog((prev) => [...prev.slice(-7), entry]);
  }, []);

  const handleRoll = useCallback(() => {
    if (isRolling || isAnimating || animatingRef.current) return;

    setIsRolling(true);
    setIsAnimating(true);
    animatingRef.current = true;
    playDiceRoll();

    // Roll animation for ~1 second
    setTimeout(() => {
      const roll = Math.ceil(Math.random() * 6);
      setDiceValue(roll);
      setIsRolling(false);

      const player = players[currentPlayerIndex];
      const fromPos = player.position;
      const rawTarget = fromPos + roll;

      // Win check: don't move if over 100
      if (rawTarget > 100) {
        addMoveLogEntry({
          playerName: player.name,
          playerColor: player.color,
          diceValue: roll,
          fromSquare: fromPos,
          toSquare: fromPos,
          event: "normal",
          timestamp: Date.now(),
        });
        toast.info(`${player.name} needs exact roll to win!`);
        setIsAnimating(false);
        animatingRef.current = false;
        // Move to next player
        setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
        return;
      }

      // Move to rawTarget first
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === player.id ? { ...p, position: rawTarget } : p,
        ),
      );
      setHighlightSquare(rawTarget);

      const checkSpecial = () => {
        if (rawTarget === 100) {
          // Win!
          playWin();
          addMoveLogEntry({
            playerName: player.name,
            playerColor: player.color,
            diceValue: roll,
            fromSquare: fromPos,
            toSquare: 100,
            event: "win",
            timestamp: Date.now(),
          });
          setWinner(player);
          setPhase("won");
          setIsAnimating(false);
          animatingRef.current = false;
          setHighlightSquare(null);
          recordWin.mutate(player.name);
          return;
        }

        if (rawTarget in SNAKES) {
          // Hit a snake
          const snakeTail = SNAKES[rawTarget];
          setActiveSnake(rawTarget);
          setTimeout(() => {
            playSnake();
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === player.id ? { ...p, position: snakeTail } : p,
              ),
            );
            setHighlightSquare(snakeTail);
            addMoveLogEntry({
              playerName: player.name,
              playerColor: player.color,
              diceValue: roll,
              fromSquare: fromPos,
              toSquare: snakeTail,
              event: "snake",
              timestamp: Date.now(),
            });
            toast.error(
              `${player.name} hit a snake! 🐍 Slides to ${snakeTail}!`,
            );
            setTimeout(() => {
              setHighlightSquare(null);
              setActiveSnake(null);
              setIsAnimating(false);
              animatingRef.current = false;
              setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
            }, 600);
          }, 600);
        } else if (rawTarget in LADDERS) {
          // Hit a ladder
          const ladderTop = LADDERS[rawTarget];
          setActiveLadder(rawTarget);
          setTimeout(() => {
            playLadder();
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === player.id ? { ...p, position: ladderTop } : p,
              ),
            );
            setHighlightSquare(ladderTop);
            addMoveLogEntry({
              playerName: player.name,
              playerColor: player.color,
              diceValue: roll,
              fromSquare: fromPos,
              toSquare: ladderTop,
              event: "ladder",
              timestamp: Date.now(),
            });
            toast.success(
              `${player.name} climbed a ladder! 🪜 Soars to ${ladderTop}!`,
            );
            setTimeout(() => {
              setHighlightSquare(null);
              setActiveLadder(null);
              setIsAnimating(false);
              animatingRef.current = false;
              setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
            }, 600);
          }, 600);
        } else {
          addMoveLogEntry({
            playerName: player.name,
            playerColor: player.color,
            diceValue: roll,
            fromSquare: fromPos,
            toSquare: rawTarget,
            event: "normal",
            timestamp: Date.now(),
          });
          setTimeout(() => {
            setHighlightSquare(null);
            setIsAnimating(false);
            animatingRef.current = false;
            setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
          }, 400);
        }
      };

      // Small delay to let token CSS transition play
      setTimeout(checkSpecial, 350);
    }, 1000);
  }, [
    isRolling,
    isAnimating,
    players,
    currentPlayerIndex,
    addMoveLogEntry,
    recordWin,
  ]);

  const handlePlayAgain = useCallback(() => {
    setWinner(null);
    setPhase("setup");
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setMoveLog([]);
    setIsRolling(false);
    setIsAnimating(false);
    animatingRef.current = false;
    setHighlightSquare(null);
    setActiveSnake(null);
    setActiveLadder(null);
  }, []);

  if (phase === "setup") {
    return (
      <div
        className="min-h-screen relative flex flex-col"
        style={{
          backgroundImage:
            "url(/assets/generated/snakes-ladders-bg.dim_1200x800.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(18,10,40,0.65)" }}
        />
        {/* Setup header with Login/Sign Up */}
        <div className="relative z-10 flex items-center justify-end gap-2 px-4 py-3">
          <LoginModal variant="standalone" />
          <SignUpModal variant="standalone" />
        </div>
        <div className="relative z-10 flex-1">
          <GameSetup onStart={handleStart} />
        </div>
        <footer className="relative z-10 py-4 px-4">
          <div className="flex flex-col items-center gap-2">
            <FooterLinks variant="light" />
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 underline transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-display font-800 text-xl text-primary tracking-tight">
          🎲 Snakes &amp; Ladders
        </h1>
        <div className="flex items-center gap-2">
          {players.map((p, idx) => (
            <motion.div
              key={p.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-600 border-2 transition-all duration-300"
              animate={{
                scale: idx === currentPlayerIndex ? 1.08 : 1,
                opacity: idx === currentPlayerIndex ? 1 : 0.5,
              }}
              style={{
                borderColor:
                  idx === currentPlayerIndex
                    ? PLAYER_COLORS[p.color]
                    : "transparent",
                backgroundColor: `${PLAYER_COLORS[p.color]}20`,
                color: PLAYER_COLORS[p.color],
              }}
              data-ocid={`header.player.${idx + 1}.tab`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: PLAYER_COLORS[p.color] }}
              />
              <span className="hidden sm:inline">{p.name}</span>
              <span className="inline sm:hidden">{p.name[0]}</span>
            </motion.div>
          ))}
          <button
            type="button"
            onClick={handleMuteToggle}
            className="rounded-full p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            data-ocid="header.mute_toggle.button"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          {/* Login / Sign Up */}
          <div className="flex items-center gap-1.5 ml-1 pl-1.5 border-l border-border/60">
            <LoginModal variant="header" />
            <SignUpModal variant="header" />
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-6xl mx-auto w-full">
        {/* Board */}
        <div className="flex-1 flex items-start justify-center">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={activeSnake ? "animate-shake" : ""}
            >
              <Board
                players={players}
                currentPlayerIndex={currentPlayerIndex}
                highlightSquare={highlightSquare}
                activeSnake={activeSnake}
                activeLadder={activeLadder}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          {/* Current Player */}
          <motion.div
            key={currentPlayerIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-4 border border-border card-glow"
            data-ocid="game.current_player.card"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-display">
              Current Turn
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center font-display font-800 text-white text-lg shadow-lg animate-glow-pulse"
                style={{ backgroundColor: PLAYER_COLORS[currentPlayer.color] }}
              >
                {currentPlayer.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-display font-800 text-xl text-foreground">
                  {currentPlayer.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentPlayer.position === 0
                    ? "Starting"
                    : `Square ${currentPlayer.position}`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Dice */}
          <div
            className="bg-card rounded-xl p-5 border border-border card-glow flex flex-col items-center"
            data-ocid="game.dice.card"
          >
            <Dice
              value={diceValue}
              isRolling={isRolling}
              disabled={isRolling || isAnimating}
              onRoll={handleRoll}
              currentPlayerColor={PLAYER_COLORS[currentPlayer.color]}
            />
          </div>

          {/* Tabs: Log + Scoreboard */}
          <div className="bg-card rounded-xl p-4 border border-border card-glow flex-1">
            <Tabs defaultValue="log">
              <TabsList className="w-full mb-3" data-ocid="game.sidebar.tab">
                <TabsTrigger
                  value="log"
                  className="flex-1 gap-1.5"
                  data-ocid="game.log.tab"
                >
                  <ScrollText size={14} />
                  Move Log
                </TabsTrigger>
                <TabsTrigger
                  value="scores"
                  className="flex-1 gap-1.5"
                  data-ocid="game.scores.tab"
                >
                  <Trophy size={14} />
                  Scores
                </TabsTrigger>
              </TabsList>
              <TabsContent value="log">
                <MoveLog entries={moveLog} />
              </TabsContent>
              <TabsContent value="scores">
                <Scoreboard />
              </TabsContent>
            </Tabs>
          </div>
        </aside>
      </main>

      {/* Win Modal */}
      <WinModal winner={winner} onPlayAgain={handlePlayAgain} />

      <footer className="py-4 px-4 border-t border-border/40">
        <div className="flex flex-col items-center gap-2">
          <FooterLinks variant="dark" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
