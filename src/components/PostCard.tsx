import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { PostHeader } from "./post/PostHeader";
import { PostContent } from "./post/PostContent";
import { PostVerificationResults } from "./post/PostVerificationResults";
import { PostFooter } from "./post/PostFooter";

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
  const [user, setUser] = useState<any>(null);
  const [referencePost, setReferencePost] = useState<any>(null);
  const [postUser, setPostUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

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

    supabase
      .from("profiles")
      .select("*")
      .eq("id", post.user_id)
      .single()
      .then(({ data }) => {
        setPostUser(data);
      });
  }, [post.reference_post_id, post.user_id]);

  return (
    <Card className="w-full animate-fadeIn">
      <CardHeader className="pb-2">
        <PostHeader
          postUserId={post.user_id}
          postUsername={postUser?.username}
          currentUserId={user?.id}
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
          userId={user?.id} 
          statement={post.statement}
        />
      </CardFooter>
    </Card>
  );
};