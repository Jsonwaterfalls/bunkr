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

      // Wait for profile creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Attempt to fetch the profile multiple times
      let profile = null;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts && !profile) {
        const { data, error } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .maybeSingle();

        if (!error && data) {
          profile = data;
          break;
        }

        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!profile) {
        throw new Error('Failed to create or fetch profile after multiple attempts');
      }

      // Proceed with verification using the confirmed profile
      await verifyStatement(statement, profile.id);
      
    } catch (error) {
      console.error('Error in verification process:', error);
      toast({
        title: "Error",
        description: "Failed to verify statement. Please try again.",
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