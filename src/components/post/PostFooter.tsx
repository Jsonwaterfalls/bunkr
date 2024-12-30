import { useState } from "react";
import { Button } from "../ui/button";
import { MessageSquare, CheckCircle } from "lucide-react";
import { PostReactions } from "../PostReactions";
import { SharePostDialog } from "../SharePostDialog";
import { CommentSection } from "../CommentSection";
import { useVerification } from "@/hooks/useVerification";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface PostFooterProps {
  postId: string;
  userId?: string;
  statement: string;
}

export const PostFooter = ({ postId, userId, statement }: PostFooterProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Query for verification results
  const { data: verificationResults, refetch: refetchResults } = useQuery({
    queryKey: ["verification-results", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verification_results")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const hasBeenVerified = verificationResults && verificationResults.length > 0;

  const { verifyStatement } = useVerification(async (statement, results) => {
    try {
      // Insert verification results into the database
      const { error } = await supabase
        .from("verification_results")
        .insert(
          results.map(result => ({
            post_id: postId,
            model: result.model,
            confidence: result.confidence,
            reasoning: result.reasoning,
            verdict: result.verdict,
          }))
        );

      if (error) throw error;

      // Refetch results to update the UI
      await refetchResults();

      toast({
        title: "Verification Complete",
        description: "The statement has been verified. Check the results above.",
      });
    } catch (error) {
      console.error("Error saving verification results:", error);
      toast({
        title: "Error",
        description: "Failed to save verification results",
        variant: "destructive",
      });
    }
  });

  const handleVerify = async () => {
    if (hasBeenVerified) {
      toast({
        title: "Already Verified",
        description: "This post has already been verified.",
        variant: "default",
      });
      return;
    }

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
            disabled={isVerifying || hasBeenVerified}
          >
            <CheckCircle className="h-4 w-4" />
            {isVerifying ? "Verifying..." : hasBeenVerified ? "Verified" : "Verify"}
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