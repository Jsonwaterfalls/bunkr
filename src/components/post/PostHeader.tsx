import { formatDistanceToNow } from "date-fns";
import { DirectMessageDialog } from "../DirectMessageDialog";
import { FollowButton } from "../FollowButton";

interface PostHeaderProps {
  postUserId: string;
  postUsername?: string;
  currentUserId?: string;
  createdAt: string;
}

export const PostHeader = ({ postUserId, postUsername, currentUserId, createdAt }: PostHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">
          {postUsername || "Anonymous"}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {currentUserId !== postUserId && (
          <>
            <DirectMessageDialog
              recipientId={postUserId}
              recipientUsername={postUsername}
            />
            <FollowButton targetUserId={postUserId} currentUserId={currentUserId} />
          </>
        )}
      </div>
    </div>
  );
};