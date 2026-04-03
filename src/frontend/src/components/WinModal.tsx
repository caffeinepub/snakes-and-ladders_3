import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { PLAYER_COLORS, type Player } from "../types/game";

interface Props {
  winner: Player | null;
  onPlayAgain: () => void;
}

const CONFETTI_COLORS = [
  "#EF4444",
  "#3B82F6",
  "#22C55E",
  "#EAB308",
  "#8B5CF6",
  "#EC4899",
];

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}%`, opacity: 1, rotate: p.rotation }}
          animate={{ y: "120%", rotate: p.rotation + 720, opacity: [1, 1, 0] }}
          transition={{
            duration: 2 + Math.random(),
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0.5,
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            top: 0,
          }}
        />
      ))}
    </div>
  );
}

export function WinModal({ winner, onPlayAgain }: Props) {
  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          data-ocid="win.modal"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative bg-card rounded-2xl p-8 max-w-sm w-full text-center border border-border overflow-hidden"
            style={{
              boxShadow: `0 0 60px 20px ${PLAYER_COLORS[winner.color]}40`,
            }}
          >
            <Confetti />

            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
              className="text-7xl mb-4"
            >
              🏆
            </motion.div>

            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-display font-800 text-white"
              style={{ backgroundColor: PLAYER_COLORS[winner.color] }}
            >
              {winner.name[0].toUpperCase()}
            </div>

            <h2 className="font-display font-800 text-4xl text-foreground mb-1">
              {winner.name}
            </h2>
            <p className="text-muted-foreground mb-2">wins the game!</p>

            <div
              className="text-6xl font-display font-800 mb-6"
              style={{ color: PLAYER_COLORS[winner.color] }}
            >
              🎉
            </div>

            <Button
              data-ocid="win.play_again_button"
              onClick={onPlayAgain}
              className="w-full py-4 text-lg font-display font-700 rounded-xl"
              style={{ backgroundColor: PLAYER_COLORS[winner.color] }}
            >
              <RotateCcw className="mr-2" size={20} />
              Play Again!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
