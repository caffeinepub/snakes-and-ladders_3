import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { type MoveLogEntry, PLAYER_COLORS } from "../types/game";

interface Props {
  entries: MoveLogEntry[];
}

function eventIcon(event: MoveLogEntry["event"]) {
  switch (event) {
    case "snake":
      return "🐍";
    case "ladder":
      return "🪜";
    case "win":
      return "🏆";
    default:
      return "🎲";
  }
}

function eventText(entry: MoveLogEntry) {
  const base = `rolled ${entry.diceValue}, moved to ${entry.toSquare}`;
  switch (entry.event) {
    case "snake":
      return `${base} — slid down a snake! 🐍`;
    case "ladder":
      return `${base} — climbed a ladder! 🪜`;
    case "win":
      return "reached 100 — WINS! 🏆";
    default:
      return base;
  }
}

export function MoveLog({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div
        className="text-center text-muted-foreground text-sm py-4"
        data-ocid="movelog.empty_state"
      >
        No moves yet. Roll to start!
      </div>
    );
  }

  return (
    <ScrollArea className="h-48" data-ocid="movelog.list">
      <div className="space-y-1.5 pr-2">
        <AnimatePresence initial={false}>
          {[...entries].reverse().map((entry, idx) => (
            <motion.div
              key={entry.timestamp}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              data-ocid={`movelog.item.${idx + 1}`}
              className="flex items-start gap-2 text-xs rounded-lg px-2 py-1.5"
              style={{
                backgroundColor: `${PLAYER_COLORS[entry.playerColor]}18`,
              }}
            >
              <span className="text-base leading-none mt-0.5">
                {eventIcon(entry.event)}
              </span>
              <div>
                <span
                  className="font-700"
                  style={{ color: PLAYER_COLORS[entry.playerColor] }}
                >
                  {entry.playerName}
                </span>{" "}
                <span className="text-muted-foreground">
                  {eventText(entry)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
