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
      // Generate a UUID for the temporary user
      const tempUserId = crypto.randomUUID();
      
      // Create a temporary profile
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: tempUserId,
          username: 'beta_tester_' + Date.now()
        }])
        .select();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: "Error",
          description: "Failed to create temporary profile",
          variant: "destructive",
        });
        return;
      }

      if (!profiles || profiles.length === 0) {
        toast({
          title: "Error",
          description: "Failed to create temporary profile",
          variant: "destructive",
        });
        return;
      }

      // Use the first profile's ID
      await verifyStatement(statement, profiles[0].id);
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