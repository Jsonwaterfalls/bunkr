import { Bell, BellDot } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { NotificationsList } from "./notifications/NotificationsList";
import { useNotifications } from "./notifications/useNotifications";

export const NotificationsPopover = () => {
  const {
    user,
    notifications,
    isLoading,
    unreadCount,
    markAsReadMutation,
  } = useNotifications();

  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                {unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsReadMutation.mutate()}
              disabled={markAsReadMutation.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <NotificationsList
          notifications={notifications}
          isLoading={isLoading}
        />
      </PopoverContent>
    </Popover>
  );
};