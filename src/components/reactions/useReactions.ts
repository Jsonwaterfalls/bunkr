import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useReactions = (postId: string, userId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reactions } = useQuery({
    queryKey: ["reactions", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_reactions")
        .select("*")
        .eq("post_id", postId);

      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({
      type,
      action,
    }: {
      type: "like" | "bookmark";
      action: "add" | "remove";
    }) => {
      if (action === "add") {
        const { error } = await supabase
          .from("post_reactions")
          .insert([{ post_id: postId, type }]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("post_reactions")
          .delete()
          .eq("post_id", postId)
          .eq("type", type)
          .is("user_id", null);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions", postId] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update reaction. Please try again.",
      });
      console.error("Reaction error:", error);
    },
  });

  const hasLiked = reactions?.some(
    (reaction) => (!reaction.user_id || reaction.user_id === userId) && reaction.type === "like"
  );
  const hasBookmarked = reactions?.some(
    (reaction) => (!reaction.user_id || reaction.user_id === userId) && reaction.type === "bookmark"
  );

  const likeCount = reactions?.filter((r) => r.type === "like").length || 0;
  const bookmarkCount = reactions?.filter((r) => r.type === "bookmark").length || 0;

  return {
    hasLiked,
    hasBookmarked,
    likeCount,
    bookmarkCount,
    handleReaction: (type: "like" | "bookmark") => {
      const isActive = type === "like" ? hasLiked : hasBookmarked;
      mutation.mutate({
        type,
        action: isActive ? "remove" : "add",
      });
    },
  };
};