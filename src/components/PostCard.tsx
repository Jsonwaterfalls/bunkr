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
    user_id: string | null;
    statement: string;
    created_at: string;
    reference_post_id?: string;
    media_url?: string | null;
    media_type?: string | null;
    verification_results: Array<{
      verdict: string;
      confidence: number;
      reasoning: string;
      model: string;
    }>;
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const defaultUserId = "00000000-0000-0000-0000-000000000000";
  const [referencePost, setReferencePost] = useState<any>(null);
  const [postUser, setPostUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch reference post if it exists
        if (post.reference_post_id) {
          const { data: refPost, error: refError } = await supabase
            .from("posts")
            .select("*")
            .eq("id", post.reference_post_id)
            .maybeSingle();

          if (refError) {
            console.error('Error fetching reference post:', refError);
          } else {
            setReferencePost(refPost);
          }
        }

        // Fetch user profile if user_id exists
        if (post.user_id) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", post.user_id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            toast({
              title: "Error",
              description: "Failed to load user profile",
              variant: "destructive",
            });
          } else {
            setPostUser(profile || { username: "Anonymous User" });
          }
        } else {
          setPostUser({ username: "Anonymous User" });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [post.reference_post_id, post.user_id, toast]);

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </Card>
    );
  }

  return (
    <Card className="w-full animate-fadeIn">
      <CardHeader className="pb-2">
        <PostHeader
          postUserId={post.user_id || defaultUserId}
          postUsername={postUser?.username || "Anonymous User"}
          currentUserId={defaultUserId}
          createdAt={post.created_at}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <PostContent
          statement={post.statement}
          referencePost={referencePost}
          mediaUrl={post.media_url}
          mediaType={post.media_type}
        />
        {post.verification_results?.length > 0 && (
          <PostVerificationResults results={post.verification_results} />
        )}
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