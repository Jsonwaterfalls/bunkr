import { Card, CardContent, CardHeader, CardFooter } from "./ui/card";
import { PostHeader } from "./post/PostHeader";
import { PostContent } from "./post/PostContent";
import { PostVerificationResults } from "./post/PostVerificationResults";
import { PostFooter } from "./post/PostFooter";
import { PostDataProvider } from "./post/PostDataProvider";
import { PostLoadingSkeleton } from "./post/PostLoadingSkeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: tags } = useQuery({
    queryKey: ["post-tags", post.id],
    queryFn: async () => {
      const { data: postTags, error } = await supabase
        .from("post_tags")
        .select(`
          tags (
            name
          )
        `)
        .eq("post_id", post.id);

      if (error) throw error;
      return postTags?.map(pt => pt.tags.name) || [];
    },
  });

  return (
    <PostDataProvider post={post}>
      {({ referencePost, postUser, isLoading }) => {
        if (isLoading) {
          return <PostLoadingSkeleton />;
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
                tags={tags}
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
      }}
    </PostDataProvider>
  );
};