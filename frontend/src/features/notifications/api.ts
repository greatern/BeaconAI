import { api } from "../../lib/api";
import type { Notification, NotificationListResponse } from "./types";

export async function listNotifications(limit = 50): Promise<NotificationListResponse> {
  const { data } = await api.get<NotificationListResponse>("/notifications", {
    params: { limit },
  });
  return data;
}

export async function markNotificationRead(id: number): Promise<Notification> {
  const { data } = await api.post<Notification>(`/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post("/notifications/read-all");
}
