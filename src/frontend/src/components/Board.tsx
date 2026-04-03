import { useMemo } from "react";
import { LADDERS, PLAYER_COLORS, type Player, SNAKES } from "../types/game";

function getSquarePosition(square: number): { row: number; col: number } {
  const row = Math.floor((square - 1) / 10);
  const col = row % 2 === 0 ? (square - 1) % 10 : 9 - ((square - 1) % 10);
  return { row, col };
}

function squareToPixel(
  square: number,
  boardSize: number,
): { x: number; y: number } {
  const cellSize = boardSize / 10;
  const { row, col } = getSquarePosition(square);
  return {
    x: col * cellSize + cellSize / 2,
    y: (9 - row) * cellSize + cellSize / 2,
  };
}

const BOARD_SIZE = 600;
const CELL = BOARD_SIZE / 10;

const SQUARE_COLORS = ["#FEF9C3", "#DCFCE7", "#FEE2E2", "#DBEAFE"];

function getSquareColor(square: number): string {
  const { row, col } = getSquarePosition(square);
  return SQUARE_COLORS[(row + col) % 4];
}

function snakePath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const perp = { x: -dy / len, y: dx / len };
  const amp = Math.min(len * 0.18, 30);
  const cp1x = x1 + dx * 0.25 + perp.x * amp;
  const cp1y = y1 + dy * 0.25 + perp.y * amp;
  const cp2x = x1 + dx * 0.5 - perp.x * amp;
  const cp2y = y1 + dy * 0.5 - perp.y * amp;
  const cp3x = x1 + dx * 0.75 + perp.x * amp;
  const cp3y = y1 + dy * 0.75 + perp.y * amp;
  return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${mx} ${my} S ${cp3x} ${cp3y}, ${x2} ${y2}`;
}

// Suppress unused variable warning - mx/my used implicitly via string template
void (0 as unknown as typeof snakePath);

// Pre-compute rung positions for ladders
function buildRungs(
  fromSq: number,
  toSq: number,
  boardSize: number,
): Array<{ key: string; x1: number; y1: number; x2: number; y2: number }> {
  const f = squareToPixel(fromSq, boardSize);
  const t = squareToPixel(toSq, boardSize);
  const dx = t.x - f.x;
  const dy = t.y - f.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const perp = { x: -uy * 5, y: ux * 5 };
  const rungCount = Math.floor(len / 20);
  const rungs: Array<{
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }> = [];
  for (let n = 1; n <= rungCount; n++) {
    const t2 = n / (rungCount + 1);
    const rx = f.x + dx * t2;
    const ry = f.y + dy * t2;
    rungs.push({
      key: `rung-${fromSq}-${n}of${rungCount}`,
      x1: rx - perp.x,
      y1: ry - perp.y,
      x2: rx + perp.x,
      y2: ry + perp.y,
    });
  }
  return rungs;
}

interface BoardProps {
  players: Player[];
  currentPlayerIndex: number;
  highlightSquare?: number | null;
  activeSnake?: number | null;
  activeLadder?: number | null;
}

export function Board({
  players,
  currentPlayerIndex,
  highlightSquare,
  activeSnake,
  activeLadder,
}: BoardProps) {
  const playersBySquare = useMemo(() => {
    const map: Record<number, Player[]> = {};
    for (const p of players) {
      if (p.position > 0) {
        if (!map[p.position]) map[p.position] = [];
        map[p.position].push(p);
      }
    }
    return map;
  }, [players]);

  // Pre-compute ladder rail+rung data
  const ladderData = useMemo(
    () =>
      Object.entries(LADDERS).map(([from, to]) => {
        const fromNum = Number(from);
        const f = squareToPixel(fromNum, BOARD_SIZE);
        const t = squareToPixel(to, BOARD_SIZE);
        const dx = t.x - f.x;
        const dy = t.y - f.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len;
        const uy = dy / len;
        const perp = { x: -uy * 5, y: ux * 5 };
        return {
          key: `ladder-${from}`,
          from,
          f,
          t,
          dx,
          dy,
          perp,
          rungs: buildRungs(fromNum, to, BOARD_SIZE),
        };
      }),
    [],
  );

  return (
    <div
      className="relative board-shadow rounded-xl overflow-hidden"
      style={{ width: BOARD_SIZE, height: BOARD_SIZE, flexShrink: 0 }}
    >
      {/* Board grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(10, ${CELL}px)`,
          gridTemplateRows: `repeat(10, ${CELL}px)`,
          width: BOARD_SIZE,
          height: BOARD_SIZE,
        }}
      >
        {Array.from({ length: 10 }, (_, rowFromTop) => {
          const rowFromBottom = 9 - rowFromTop;
          const baseSquare = rowFromBottom * 10 + 1;
          const rowSquares = Array.from({ length: 10 }, (__, colIdx) => {
            if (rowFromBottom % 2 === 0) return baseSquare + colIdx;
            return baseSquare + (9 - colIdx);
          });
          return rowSquares.map((sq) => {
            const isSnakeHead = sq in SNAKES;
            const isLadderBottom = sq in LADDERS;
            const isSnakeTail = Object.values(SNAKES).includes(sq);
            const isLadderTop = Object.values(LADDERS).includes(sq);
            const isHighlighted = sq === highlightSquare;

            return (
              <div
                key={sq}
                style={{
                  backgroundColor: isHighlighted
                    ? "#FCD34D"
                    : getSquareColor(sq),
                  width: CELL,
                  height: CELL,
                  position: "relative",
                  border: "1px solid rgba(0,0,0,0.08)",
                  transition: "background-color 0.3s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: 4,
                    fontSize: CELL < 60 ? 9 : 11,
                    fontWeight: 700,
                    color: "rgba(0,0,0,0.45)",
                    lineHeight: 1,
                    userSelect: "none",
                    fontFamily: "BricolageGrotesque, sans-serif",
                  }}
                >
                  {sq}
                </span>
                {isSnakeHead && (
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-60%)",
                      fontSize: CELL < 60 ? 14 : 18,
                      userSelect: "none",
                    }}
                  >
                    🐍
                  </span>
                )}
                {isLadderBottom && (
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-60%)",
                      fontSize: CELL < 60 ? 14 : 18,
                      userSelect: "none",
                    }}
                  >
                    🪜
                  </span>
                )}
                {isSnakeTail && !isSnakeHead && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "#EF4444",
                      opacity: 0.5,
                    }}
                  />
                )}
                {isLadderTop && !isLadderBottom && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "#22C55E",
                      opacity: 0.5,
                    }}
                  />
                )}
                {/* Emoji burst overlay on triggered snake/ladder square */}
                {(activeSnake === sq || activeLadder === sq) && (
                  <span
                    key={`burst-${sq}-${activeSnake ?? activeLadder}`}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      fontSize: CELL < 60 ? 20 : 28,
                      pointerEvents: "none",
                      zIndex: 50,
                    }}
                    className="animate-emoji-burst"
                  >
                    {activeSnake === sq ? "🐍" : "🪜"}
                  </span>
                )}
              </div>
            );
          });
        })}
      </div>

      {/* SVG Overlay */}
      <svg
        aria-label="Snakes and ladders paths"
        role="img"
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        width={BOARD_SIZE}
        height={BOARD_SIZE}
      >
        {/* Ladders */}
        {ladderData.map(({ key, from, f, t, perp, rungs }) => (
          <g
            key={key}
            className={
              activeLadder !== null &&
              activeLadder !== undefined &&
              activeLadder === Number(from)
                ? "animate-ladder-glow"
                : undefined
            }
          >
            <line
              x1={f.x - perp.x}
              y1={f.y - perp.y}
              x2={t.x - perp.x}
              y2={t.y - perp.y}
              stroke="#92400e"
              strokeWidth="3"
              strokeOpacity="0.85"
              strokeLinecap="round"
            />
            <line
              x1={f.x + perp.x}
              y1={f.y + perp.y}
              x2={t.x + perp.x}
              y2={t.y + perp.y}
              stroke="#92400e"
              strokeWidth="3"
              strokeOpacity="0.85"
              strokeLinecap="round"
            />
            {rungs.map((rung) => (
              <line
                key={rung.key}
                x1={rung.x1}
                y1={rung.y1}
                x2={rung.x2}
                y2={rung.y2}
                stroke="#B45309"
                strokeWidth="2"
                strokeOpacity="0.7"
                strokeLinecap="round"
              />
            ))}
          </g>
        ))}

        {/* Snakes */}
        {Object.entries(SNAKES).map(([from, to]) => {
          const f = squareToPixel(Number(from), BOARD_SIZE);
          const t = squareToPixel(to, BOARD_SIZE);
          return (
            <g
              key={`snake-${from}`}
              className={
                activeSnake !== null &&
                activeSnake !== undefined &&
                activeSnake === Number(from)
                  ? "animate-snake-glow"
                  : undefined
              }
            >
              <path
                d={snakePath(f.x, f.y, t.x, t.y)}
                fill="none"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d={snakePath(f.x, f.y, t.x, t.y)}
                fill="none"
                stroke="#EF4444"
                strokeWidth="5"
                strokeLinecap="round"
                strokeOpacity="0.9"
              />
              <path
                d={snakePath(f.x, f.y, t.x, t.y)}
                fill="none"
                stroke="#FCA5A5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.6"
              />
              <circle
                cx={f.x}
                cy={f.y}
                r="7"
                fill="#DC2626"
                stroke="white"
                strokeWidth="1.5"
              />
              <circle cx={f.x} cy={f.y} r="3" fill="white" opacity="0.7" />
            </g>
          );
        })}
      </svg>

      {/* Player Tokens overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: BOARD_SIZE,
          height: BOARD_SIZE,
          pointerEvents: "none",
        }}
      >
        {Object.entries(playersBySquare).map(([sq, sqPlayers]) => {
          const pixel = squareToPixel(Number(sq), BOARD_SIZE);
          return sqPlayers.map((player, stackIdx) => {
            const total = sqPlayers.length;
            const offsetX = total > 1 ? (stackIdx - (total - 1) / 2) * 14 : 0;
            const isActive = player.id === players[currentPlayerIndex]?.id;
            return (
              <div
                key={player.id}
                title={player.name}
                style={{
                  position: "absolute",
                  width: total > 2 ? 20 : 24,
                  height: total > 2 ? 20 : 24,
                  backgroundColor: PLAYER_COLORS[player.color],
                  border: `2.5px solid ${isActive ? "white" : "rgba(255,255,255,0.6)"}`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 800,
                  color: "white",
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                  zIndex: 10 + stackIdx + (isActive ? 20 : 0),
                  boxShadow: isActive
                    ? `0 0 0 2px white, 0 0 10px 3px ${PLAYER_COLORS[player.color]}`
                    : "0 2px 6px rgba(0,0,0,0.5)",
                  left: pixel.x - (total > 2 ? 10 : 12) + offsetX,
                  top: pixel.y - (total > 2 ? 10 : 12),
                  transition:
                    "left 0.4s cubic-bezier(0.4,0,0.2,1), top 0.4s cubic-bezier(0.4,0,0.2,1)",
                  fontFamily: "BricolageGrotesque, sans-serif",
                }}
              >
                {player.name[0].toUpperCase()}
              </div>
            );
          });
        })}
      </div>

      {/* Square 100 trophy */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: BOARD_SIZE - CELL,
          width: CELL,
          height: CELL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          pointerEvents: "none",
        }}
      >
        🏆
      </div>
    </div>
  );
}
