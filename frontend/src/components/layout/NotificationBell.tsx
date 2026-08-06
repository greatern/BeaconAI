import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, MapPin } from "lucide-react";

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../../features/notifications/hooks";
import type { Notification } from "../../features/notifications/types";

function timeAgo(isoDate: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  function handleSelect(notification: Notification) {
    if (!notification.is_read) markRead.mutate(notification.id);
    setOpen(false);
    navigate("/map");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-1 rounded-full hover:bg-stone-100"
        aria-label="Notifications"
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] leading-none rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-lg border border-stone-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
              <span className="font-semibold text-sm">Notifications</span>

              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="text-sm text-stone-400 text-center py-8">
                  Nothing nearby yet.
                </p>
              )}

              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleSelect(notification)}
                  className={`w-full text-left px-4 py-3 border-b border-stone-50 last:border-0 hover:bg-stone-50 flex gap-2.5 ${
                    notification.is_read ? "" : "bg-primary/5"
                  }`}
                >
                  <MapPin size={15} className="text-stone-400 shrink-0 mt-0.5" />

                  <div className="min-w-0">
                    <p className="text-sm text-stone-700 leading-snug">{notification.message}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{timeAgo(notification.created_at)}</p>
                  </div>

                  {!notification.is_read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
