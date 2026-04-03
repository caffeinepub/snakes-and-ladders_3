import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Trophy } from "lucide-react";
import { motion } from "motion/react";
import {
  useRecentWinners,
  useResetScoreboard,
  useSortedScoreboard,
} from "../hooks/useQueries";
import { COLORS_ORDER, PLAYER_COLORS } from "../types/game";

export function Scoreboard() {
  const { data: scoreboard, isLoading: loadingBoard } = useSortedScoreboard();
  const { data: recent } = useRecentWinners();
  const resetMutation = useResetScoreboard();

  const medalEmoji = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-4" data-ocid="scoreboard.panel">
      {recent && recent.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-display">
            Recent Winners
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {recent.map((name) => (
              <span
                key={name}
                className="text-xs px-2 py-0.5 rounded-full font-600"
                style={{
                  backgroundColor: `${PLAYER_COLORS[COLORS_ORDER[0]]}25`,
                  color: PLAYER_COLORS[COLORS_ORDER[0]],
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-display">
          All-Time Wins
        </h3>
        {loadingBoard ? (
          <div
            className="flex justify-center py-4"
            data-ocid="scoreboard.loading_state"
          >
            <Loader2 className="animate-spin text-muted-foreground" size={20} />
          </div>
        ) : !scoreboard || scoreboard.length === 0 ? (
          <div
            className="text-center text-muted-foreground text-sm py-4"
            data-ocid="scoreboard.empty_state"
          >
            No wins recorded yet!
          </div>
        ) : (
          <div className="space-y-1.5" data-ocid="scoreboard.table">
            {scoreboard.slice(0, 8).map((entry, idx) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                data-ocid={`scoreboard.item.${idx + 1}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 bg-muted/50"
              >
                <span className="text-base w-6 text-center">
                  {idx < 3 ? (
                    medalEmoji[idx]
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">
                      {idx + 1}
                    </span>
                  )}
                </span>
                <Trophy size={12} className="text-primary flex-shrink-0" />
                <span className="text-sm font-600 flex-1 truncate text-foreground">
                  {entry.name}
                </span>
                <span className="text-sm font-display font-800 text-primary">
                  {entry.wins.toString()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Button
        data-ocid="scoreboard.reset_button"
        variant="outline"
        size="sm"
        className="w-full text-xs text-muted-foreground border-border hover:text-destructive hover:border-destructive"
        onClick={() => resetMutation.mutate()}
        disabled={resetMutation.isPending}
      >
        {resetMutation.isPending ? (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        ) : (
          <RefreshCw className="mr-1 h-3 w-3" />
        )}
        Reset Scoreboard
      </Button>
    </div>
  );
}
