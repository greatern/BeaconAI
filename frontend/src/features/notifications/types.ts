export const NOTIFICATION_REASONS = ["near_home", "near_work"] as const;

export type NotificationReason = (typeof NOTIFICATION_REASONS)[number];

export interface Notification {
  id: number;
  report_id: number;
  reason: NotificationReason;
  distance_meters: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  total: number;
  unread_count: number;
  notifications: Notification[];
}
