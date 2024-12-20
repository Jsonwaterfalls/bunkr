import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { PostHeader } from "./post/PostHeader";
import { PostContent } from "./post/PostContent";
import { PostVerificationResults } from "./post/PostVerificationResults";
import { PostFooter } from "./post/PostFooter";
import { useToast } from "@/hooks/use-toast";

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
  // For beta testing, use a default user
  const defaultUserId = "00000000-0000-0000-0000-000000000000";
  const [referencePost, setReferencePost] = useState<any>(null);
  const [postUser, setPostUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (post.reference_post_id) {
      supabase
        .from("posts")
        .select("*")
        .eq("id", post.reference_post_id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching reference post:', error);
            return;
          }
          setReferencePost(data);
        });
    }

    supabase
      .from("profiles")
      .select("*")
      .eq("id", post.user_id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive",
          });
          return;
        }
        setPostUser(data || { username: "Anonymous User" });
      });
  }, [post.reference_post_id, post.user_id, toast]);

  return (
    <Card className="w-full animate-fadeIn">
      <CardHeader className="pb-2">
        <PostHeader
          postUserId={post.user_id}
          postUsername={postUser?.username || "Anonymous User"}
          currentUserId={defaultUserId}
          createdAt={post.created_at}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <PostContent
          statement={post.statement}
          referencePost={referencePost}
        />
        <PostVerificationResults results={post.verification_results} />
      </CardContent>
      <CardFooter>
        <PostFooter 
          postId={post.id} 
          userId={defaultUserId}
          statement={post.statement}
        />
      </CardFooter>
    </Card>
  );
};