import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "./PostCard";
import { ScrollArea } from "./ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const Feed = () => {
  const [user, setUser] = useState<any>(null);
  const [feedType, setFeedType] = useState<"all" | "following">("all");
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", feedType, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          verification_results (*)
        `)
        .order("created_at", { ascending: false });

      if (feedType === "following" && user?.id) {
        const { data: followingIds } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);

        const followingUserIds = followingIds?.map(f => f.following_id) || [];
        
        if (followingUserIds.length > 0) {
          query = query.in("user_id", followingUserIds);
        } else {
          return [];
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
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
          {posts?.length === 0 && (
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