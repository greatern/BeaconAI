import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../context/AuthContext";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "./api";

// 20s rather than the 3s used for AI-enrichment polling - notifications
// aren't time-critical the way "did my report finish processing" is,
// so there's no reason to hit the API that aggressively for a bell icon.
const NOTIFICATION_POLL_MS = 20_000;

export function useNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(),
    enabled: !!user,
    refetchInterval: NOTIFICATION_POLL_MS,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
