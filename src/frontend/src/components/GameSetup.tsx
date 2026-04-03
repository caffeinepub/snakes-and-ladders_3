import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dices, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  COLORS_ORDER,
  PLAYER_COLORS,
  PLAYER_COLOR_NAMES,
  type PlayerColor,
} from "../types/game";

interface Props {
  onStart: (playerNames: string[]) => void;
}

export function GameSetup({ onStart }: Props) {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
  ]);

  const handleNameChange = (idx: number, val: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleStart = () => {
    const activeNames = names
      .slice(0, playerCount)
      .map((n, i) => n.trim() || `Player ${i + 1}`);
    onStart(activeNames);
  };

  const playerCounts = [2, 3, 4];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
            className="text-7xl mb-4 inline-block"
          >
            🎲
          </motion.div>
          <h1 className="font-display text-5xl font-800 text-primary mb-2 tracking-tight">
            Snakes &amp;
            <br />
            Ladders
          </h1>
          <p className="text-muted-foreground text-lg">
            The classic board game, reimagined!
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 card-glow border border-border">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-primary" />
              <span className="font-display font-700 text-foreground text-sm tracking-wide uppercase">
                Number of Players
              </span>
            </div>
            <div className="flex gap-2">
              {playerCounts.map((n) => (
                <button
                  type="button"
                  key={n}
                  data-ocid={`setup.player_count.${n}.button`}
                  onClick={() => setPlayerCount(n)}
                  className={`flex-1 py-3 rounded-xl font-display font-700 text-xl transition-all duration-200 border-2 ${
                    playerCount === n
                      ? "bg-primary text-primary-foreground border-primary scale-105 shadow-lg"
                      : "bg-muted text-muted-foreground border-transparent hover:border-border hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {Array.from({ length: playerCount }).map((_, idx) => {
              const color = COLORS_ORDER[idx] as PlayerColor;
              const playerKey = `player-slot-${idx}`;
              return (
                <motion.div
                  key={playerKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white/20 shadow"
                    style={{ backgroundColor: PLAYER_COLORS[color] }}
                  />
                  <div className="flex-1">
                    <Input
                      data-ocid={`setup.player_name.${idx + 1}.input`}
                      value={names[idx]}
                      onChange={(e) => handleNameChange(idx, e.target.value)}
                      placeholder={`Player ${idx + 1}`}
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-14 text-right">
                    {PLAYER_COLOR_NAMES[color]}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <Button
            data-ocid="setup.start_button"
            onClick={handleStart}
            className="w-full py-6 font-display font-700 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            style={{ fontSize: "1.2rem" }}
          >
            <Dices className="mr-2" size={24} />
            Let&apos;s Play!
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          First to reach square 100 wins! 🏆
        </p>
      </motion.div>
    </div>
  );
}
