import { useState } from "react";
import { Button } from "../ui/button";
import { MessageSquare, CheckCircle } from "lucide-react";
import { PostReactions } from "../PostReactions";
import { SharePostDialog } from "../SharePostDialog";
import { CommentSection } from "../CommentSection";
import { useVerification } from "@/hooks/useVerification";
import { useToast } from "@/hooks/use-toast";

interface PostFooterProps {
  postId: string;
  userId?: string;
  statement: string;
}

export const PostFooter = ({ postId, userId, statement }: PostFooterProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const { verifyStatement } = useVerification((statement, results) => {
    toast({
      title: "Verification Complete",
      description: "The statement has been verified. Check the results above.",
    });
  });

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await verifyStatement(statement);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-4">
      <div className="flex justify-between items-center">
        <PostReactions postId={postId} userId={userId} />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleVerify}
            disabled={isVerifying}
          >
            <CheckCircle className="h-4 w-4" />
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
          <SharePostDialog post={{ id: postId, statement }} />
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