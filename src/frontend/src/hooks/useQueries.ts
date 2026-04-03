import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSortedScoreboard() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["scoreboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSortedScoreboard();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useRecentWinners() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["recentWinners"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentWinners();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useRecordWin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) return;
      await actor.recordWin(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scoreboard"] });
      queryClient.invalidateQueries({ queryKey: ["recentWinners"] });
    },
  });
}

export function useResetScoreboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.resetScoreboard();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scoreboard"] });
      queryClient.invalidateQueries({ queryKey: ["recentWinners"] });
    },
  });
}
