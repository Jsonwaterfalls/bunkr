import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "./PostCard";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const Feed = () => {
  // For beta testing, use a default user ID
  const defaultUserId = "00000000-0000-0000-0000-000000000000";
  const [feedType, setFeedType] = useState<"all" | "following">("all");
  const isMobile = useIsMobile();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", feedType, defaultUserId],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          verification_results (*)
        `)
        .order("created_at", { ascending: false });

      if (feedType === "following") {
        // Only fetch following posts if we have a valid user ID
        if (defaultUserId) {
          const { data: followingIds } = await supabase
            .from("follows")
            .select("following_id")
            .eq("follower_id", defaultUserId);

          const followingUserIds = followingIds?.map(f => f.following_id) || [];
          
          if (followingUserIds.length > 0) {
            query = query.in("user_id", followingUserIds);
          } else {
            return [];
          }
        } else {
          return [];
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: feedType === "all" || Boolean(defaultUserId), // Only run the query if we have what we need
  });

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 sticky top-0 bg-background z-10 py-2">
        <Button
          variant={feedType === "all" ? "default" : "outline"}
          onClick={() => setFeedType("all")}
          className="flex-1 md:flex-none"
        >
          All Posts
        </Button>
        <Button
          variant={feedType === "following" ? "default" : "outline"}
          onClick={() => setFeedType("following")}
          className="flex-1 md:flex-none"
        >
          Following
        </Button>
      </div>
      <ScrollArea className={`${isMobile ? 'h-[calc(100vh-300px)]' : 'h-[600px]'} w-full rounded-md border p-4`}>
        <div className="space-y-4">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {!posts?.length && (
            <div className="text-center text-muted-foreground py-8">
              {feedType === "following" 
                ? "No posts from users you follow. Start following some users!"
                : "No posts yet. Be the first to post!"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};