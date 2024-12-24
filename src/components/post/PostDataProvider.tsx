import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PostDataProviderProps {
  post: {
    id: string;
    user_id: string | null;
    reference_post_id?: string;
  };
  children: (data: {
    referencePost: any;
    postUser: any;
    isLoading: boolean;
  }) => React.ReactNode;
}

export const PostDataProvider = ({ post, children }: PostDataProviderProps) => {
  const [referencePost, setReferencePost] = useState<any>(null);
  const [postUser, setPostUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

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

  return children({ referencePost, postUser, isLoading });
};