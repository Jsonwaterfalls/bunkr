import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useVerification } from "@/hooks/useVerification";
import { VoiceRecorder } from "./VoiceRecorder";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VerificationFormProps {
  onVerify: (statement: string, results: any[]) => void;
}

export const VerificationForm = ({ onVerify }: VerificationFormProps) => {
  const [statement, setStatement] = useState("");
  const { isVerifying, verifyStatement } = useVerification(onVerify);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;
    
    try {
      // Sign in anonymously to create a temporary user
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

      // Wait for profile creation and verify it exists
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive",
        });
        return;
      }

      if (!profile) {
        console.error('Profile not found after creation');
        toast({
          title: "Error",
          description: "Profile creation failed",
          variant: "destructive",
        });
        return;
      }

      // Use the verified profile's ID for verification
      await verifyStatement(statement, profile.id);
    } catch (error) {
      console.error('Error in verification process:', error);
      toast({
        title: "Error",
        description: "Failed to verify statement",
        variant: "destructive",
      });
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
          placeholder="Enter a statement to verify..."
          className="min-h-[100px]"
        />
        <VoiceRecorder onTranscription={handleTranscription} />
      </div>
      <Button type="submit" disabled={isVerifying || !statement.trim()}>
        {isVerifying ? "Verifying..." : "Verify Statement"}
      </Button>
    </form>
  );
};