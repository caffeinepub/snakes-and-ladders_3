import { PLAYER_COLORS, type PlayerColor } from "../types/game";

interface Props {
  color: PlayerColor;
  label: string;
  style?: React.CSSProperties;
  isActive?: boolean;
  stackIndex?: number;
  totalInStack?: number;
}

export function PlayerToken({
  color,
  label,
  style,
  isActive,
  stackIndex = 0,
  totalInStack = 1,
}: Props) {
  const hex = PLAYER_COLORS[color];
  const size = totalInStack > 2 ? 20 : 24;
  const offset = stackIndex * (totalInStack > 2 ? 8 : 10);
  const negOffset = -offset;

  return (
    <div
      title={label}
      style={{
        width: size,
        height: size,
        backgroundColor: hex,
        border: `2px solid ${isActive ? "white" : "rgba(255,255,255,0.5)"}`,
        borderRadius: "50%",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 9,
        fontWeight: 800,
        color: "white",
        textShadow: "0 1px 2px rgba(0,0,0,0.8)",
        zIndex: 10 + stackIndex,
        transform: `translate(${offset}px, ${negOffset}px)`,
        boxShadow: isActive
          ? `0 0 0 2px white, 0 0 12px 4px ${hex}`
          : "0 2px 4px rgba(0,0,0,0.4)",
        transition:
          "left 0.35s cubic-bezier(0.4,0,0.2,1), top 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s",
        ...style,
      }}
    >
      {label[0].toUpperCase()}
    </div>
  );
}
