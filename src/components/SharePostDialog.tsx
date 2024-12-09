import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SharePostDialogProps {
  post: {
    id: string;
    statement: string;
  };
}

export const SharePostDialog = ({ post }: SharePostDialogProps) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      setIsLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to share posts",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("posts").insert({
        statement: comment || "Shared a post", // Use comment if provided, otherwise default text
        reference_post_id: post.id,
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Post shared",
        description: "The post has been shared successfully",
      });
      setComment("");
    } catch (error) {
      console.error("Error sharing post:", error);
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">{post.statement}</p>
          </div>
          <Textarea
            placeholder="Add a comment (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button 
            onClick={handleShare} 
            disabled={isLoading}
            className="w-full"
          >
            Share Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};