import { ThumbsUp, Bookmark } from "lucide-react";
import { ReactionButton } from "./reactions/ReactionButton";
import { useReactions } from "./reactions/useReactions";

interface PostReactionsProps {
  postId: string;
  userId: string | undefined;
}

export const PostReactions = ({ postId, userId }: PostReactionsProps) => {
  const { hasLiked, hasBookmarked, likeCount, bookmarkCount, handleReaction } = useReactions(postId, userId);

  return (
    <div className="flex gap-4">
      <ReactionButton
        icon={ThumbsUp}
        count={likeCount}
        isActive={hasLiked}
        activeColor="text-blue-500"
        onClick={() => handleReaction("like")}
      />
      <ReactionButton
        icon={Bookmark}
        count={bookmarkCount}
        isActive={hasBookmarked}
        activeColor="text-yellow-500"
        onClick={() => handleReaction("bookmark")}
      />
    </div>
  );
};