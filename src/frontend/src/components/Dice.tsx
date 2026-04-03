import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: number | null;
  isRolling: boolean;
  disabled: boolean;
  onRoll: () => void;
  currentPlayerColor: string;
}

const DOT_POSITIONS: Record<number, Array<[number, number]>> = {
  1: [[50, 50]],
  2: [
    [25, 25],
    [75, 75],
  ],
  3: [
    [25, 25],
    [50, 50],
    [75, 75],
  ],
  4: [
    [25, 25],
    [75, 25],
    [25, 75],
    [75, 75],
  ],
  5: [
    [25, 25],
    [75, 25],
    [50, 50],
    [25, 75],
    [75, 75],
  ],
  6: [
    [25, 20],
    [75, 20],
    [25, 50],
    [75, 50],
    [25, 80],
    [75, 80],
  ],
};

function DiceFace({ value, color }: { value: number; color: string }) {
  const dots = DOT_POSITIONS[value] || [];
  return (
    <svg
      viewBox="0 0 100 100"
      width="72"
      height="72"
      role="img"
      aria-label={`Dice showing ${value}`}
    >
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="18"
        ry="18"
        fill="white"
        stroke={color}
        strokeWidth="4"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
      />
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" fill={color} />
      ))}
    </svg>
  );
}

export function Dice({
  value,
  isRolling,
  disabled,
  onRoll,
  currentPlayerColor,
}: Props) {
  const [displayValue, setDisplayValue] = useState(value ?? 1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRolling) {
      intervalRef.current = setInterval(() => {
        setDisplayValue(Math.ceil(Math.random() * 6));
      }, 80);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (value !== null) setDisplayValue(value);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRolling, value]);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        data-ocid="game.dice_roll.button"
        onClick={onRoll}
        disabled={disabled}
        className="group relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-150 active:scale-95 hover:scale-105"
        aria-label="Roll dice"
      >
        <motion.div
          className={isRolling ? "animate-dice-roll" : ""}
          whileHover={!disabled ? { scale: 1.1, rotate: 5 } : {}}
          whileTap={!disabled ? { scale: 0.9 } : {}}
        >
          <DiceFace value={displayValue} color={currentPlayerColor} />
        </motion.div>
        {!isRolling && !disabled && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none animate-glow-pulse opacity-40"
            style={{ boxShadow: `0 0 16px 4px ${currentPlayerColor}` }}
          />
        )}
      </button>

      <button
        type="button"
        data-ocid="game.roll_button"
        onClick={onRoll}
        disabled={disabled}
        className={`px-6 py-3 rounded-xl font-display font-700 text-lg transition-all duration-200 select-none ${
          disabled
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "text-white shadow-lg hover:opacity-90 active:scale-95"
        }`}
        style={!disabled ? { backgroundColor: currentPlayerColor } : {}}
      >
        {isRolling ? "Rolling..." : "Roll Dice! 🎲"}
      </button>

      <AnimatePresence mode="wait">
        {!isRolling && value !== null && (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-2xl font-display font-800 text-primary"
          >
            You rolled a {value}!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
