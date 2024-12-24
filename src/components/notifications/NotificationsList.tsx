import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";

interface NotificationsListProps {
  notifications: any[];
  isLoading: boolean;
}

export const NotificationsList = ({
  notifications,
  isLoading,
}: NotificationsListProps) => {
  return (
    <ScrollArea className="h-[300px]">
      {isLoading ? (
        <p className="text-center text-muted-foreground py-4">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No notifications yet
        </p>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};