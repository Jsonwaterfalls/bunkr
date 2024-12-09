import { useState } from "react";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";
import { PostReactions } from "../PostReactions";
import { SharePostDialog } from "../SharePostDialog";
import { CommentSection } from "../CommentSection";

interface PostFooterProps {
  postId: string;
  userId?: string;
}

export const PostFooter = ({ postId, userId }: PostFooterProps) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="flex flex-col items-stretch gap-4">
      <div className="flex justify-between items-center">
        <PostReactions postId={postId} userId={userId} />
        <div className="flex items-center gap-2">
          <SharePostDialog post={{ id: postId }} />
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            Comments
          </Button>
        </div>
      </div>
      {showComments && <CommentSection postId={postId} />}
    </div>
  );
};