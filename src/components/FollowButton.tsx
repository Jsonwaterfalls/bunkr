import { useState } from "react";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  currentUserId?: string;
}

export const FollowButton = ({ targetUserId, currentUserId }: FollowButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: isFollowing, isLoading } = useQuery({
    queryKey: ["following", targetUserId, currentUserId],
    queryFn: async () => {
      if (!currentUserId) return false;
      
      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId)
        .maybeSingle();
      
      if (error) {
        console.error("Follow check error:", error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!currentUserId && !!targetUserId,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: currentUserId, following_id: targetUserId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following", targetUserId] });
      toast({
        title: "Success",
        description: "You are now following this user",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
      console.error("Follow error:", error);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following", targetUserId] });
      toast({
        title: "Success",
        description: "You have unfollowed this user",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
      console.error("Unfollow error:", error);
    },
  });

  if (!currentUserId || currentUserId === targetUserId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={() => {
        if (isFollowing) {
          unfollowMutation.mutate();
        } else {
          followMutation.mutate();
        }
      }}
      disabled={isLoading || followMutation.isPending || unfollowMutation.isPending}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
};