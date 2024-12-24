import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useVerification } from "@/hooks/useVerification";
import { VoiceRecorder } from "./VoiceRecorder";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Upload, Image, Film } from "lucide-react";

interface VerificationFormProps {
  onVerify: (statement: string, results: any[]) => void;
}

export const VerificationForm = ({ onVerify }: VerificationFormProps) => {
  const [statement, setStatement] = useState("");
  const [shouldVerify, setShouldVerify] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const { isVerifying, verifyStatement } = useVerification(onVerify);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or video file",
          variant: "destructive",
        });
        return;
      }
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setMediaFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInAnonymously();
      
      if (authError || !user) {
        console.error('Anonymous auth error:', authError);
        toast({
          title: "Error",
          description: "Failed to create temporary session",
          variant: "destructive",
        });
        return;
      }

      let mediaUrl = null;
      let mediaType = null;

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, mediaFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        mediaUrl = publicUrl;
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
      }

      // Create the post first
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([
          { 
            user_id: user.id, 
            statement: statement.trim(),
            media_url: mediaUrl,
            media_type: mediaType
          }
        ])
        .select()
        .single();

      if (postError) throw postError;

      if (shouldVerify) {
        await verifyStatement(statement, user.id);
      }

      setStatement("");
      setMediaFile(null);
      toast({
        title: "Success",
        description: "Your post has been created successfully",
      });
    } catch (error) {
      console.error('Error in submission:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTranscription = (text: string) => {
    setStatement(text);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-2">
        <Textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[100px]"
        />
        <VoiceRecorder onTranscription={handleTranscription} />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="verify-mode"
          checked={shouldVerify}
          onCheckedChange={setShouldVerify}
        />
        <Label htmlFor="verify-mode">Verify this statement</Label>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="media-upload"
          />
          <Label
            htmlFor="media-upload"
            className="flex items-center gap-2 cursor-pointer hover:text-primary"
          >
            {mediaFile ? (
              <>
                {mediaFile.type.startsWith('image/') ? (
                  <Image className="h-4 w-4" />
                ) : (
                  <Film className="h-4 w-4" />
                )}
                {mediaFile.name}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Add media
              </>
            )}
          </Label>
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting || (!statement.trim() && !mediaFile) || (shouldVerify && isVerifying)}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
};