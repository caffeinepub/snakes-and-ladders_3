import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlayerStats {
    name: string;
    wins: bigint;
}
export interface backendInterface {
    getPlayerCount(): Promise<bigint>;
    getPlayerWins(name: string): Promise<bigint | null>;
    getRecentWinners(): Promise<Array<string>>;
    getScoreboard(): Promise<Array<[string, bigint]>>;
    getSortedScoreboard(): Promise<Array<PlayerStats>>;
    getTopPlayers(count: bigint): Promise<Array<PlayerStats>>;
    getTotalGames(): Promise<bigint>;
    recordWin(name: string): Promise<void>;
    resetScoreboard(): Promise<void>;
}
