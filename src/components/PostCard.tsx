import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CommentSection } from "./CommentSection";
import { PostReactions } from "./PostReactions";
import { supabase } from "@/integrations/supabase/client";
import { FollowButton } from "./FollowButton";
import { DirectMessageDialog } from "./DirectMessageDialog";
import { SharePostDialog } from "./SharePostDialog";

interface PostCardProps {
  post: {
    id: string;
    user_id: string;
    statement: string;
    created_at: string;
    reference_post_id?: string;
    verification_results: Array<{
      verdict: string;
      confidence: number;
      reasoning: string;
      model: string;
    }>;
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [referencePost, setReferencePost] = useState<any>(null);
  const [postUser, setPostUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Fetch the referenced post if it exists
    if (post.reference_post_id) {
      supabase
        .from("posts")
        .select("*")
        .eq("id", post.reference_post_id)
        .single()
        .then(({ data }) => {
          setReferencePost(data);
        });
    }

    // Fetch the post creator's profile
    supabase
      .from("profiles")
      .select("*")
      .eq("id", post.user_id)
      .single()
      .then(({ data }) => {
        setPostUser(data);
      });
  }, [post.reference_post_id, post.user_id]);

  const getVerdictColor = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case "true":
        return "text-green-600";
      case "false":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <Card className="w-full animate-fadeIn">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {postUser?.username || "Anonymous"}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user?.id !== post.user_id && (
              <>
                <DirectMessageDialog
                  recipientId={post.user_id}
                  recipientUsername={postUser?.username}
                />
                <FollowButton targetUserId={post.user_id} currentUserId={user?.id} />
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {referencePost && (
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="text-muted-foreground mb-2">Shared post:</p>
            <p>{referencePost.statement}</p>
          </div>
        )}
        <p className="text-lg">{post.statement}</p>
        <div className="space-y-2">
          {post.verification_results?.map((result, index) => (
            <div
              key={index}
              className="rounded-lg bg-muted/50 p-3 text-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{result.model}</span>
                <span className={getVerdictColor(result.verdict)}>
                  {result.verdict.toUpperCase()} ({result.confidence}%)
                </span>
              </div>
              <p className="text-muted-foreground">{result.reasoning}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4">
        <div className="flex justify-between items-center">
          <PostReactions postId={post.id} userId={user?.id} />
          <div className="flex items-center gap-2">
            <SharePostDialog post={post} />
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
        {showComments && <CommentSection postId={post.id} />}
      </CardFooter>
    </Card>
  );
};