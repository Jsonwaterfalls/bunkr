import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    read: boolean;
    created_at: string;
    actor?: {
      username: string;
    };
    post?: {
      statement: string;
    };
  };
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const getNotificationText = () => {
    switch (notification.type) {
      case "follow":
        return `${notification.actor?.username || "Someone"} started following you`;
      case "post":
        return `${notification.actor?.username || "Someone"} shared a new post: "${
          notification.post?.statement || ""
        }"`;
      default:
        return "New notification";
    }
  };

  return (
    <div
      className={`p-3 rounded-lg ${!notification.read ? "bg-muted" : ""}`}
    >
      <p className="text-sm">{getNotificationText()}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {formatDistanceToNow(new Date(notification.created_at), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
};