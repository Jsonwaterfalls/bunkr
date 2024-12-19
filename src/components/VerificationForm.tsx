import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useVerification } from "@/hooks/useVerification";
import { VoiceRecorder } from "./VoiceRecorder";
import { supabase } from "@/integrations/supabase/client";

interface VerificationFormProps {
  onVerify: (statement: string, results: any[]) => void;
}

export const VerificationForm = ({ onVerify }: VerificationFormProps) => {
  const [statement, setStatement] = useState("");
  const { isVerifying, verifyStatement } = useVerification(onVerify);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;
    
    try {
      // Generate a UUID for the temporary user
      const tempUserId = crypto.randomUUID();
      
      // Create a temporary profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: tempUserId,
          username: 'beta_tester_' + Date.now()
        })
        .select()
        .maybeSingle();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      if (!profile) {
        throw new Error('Failed to create temporary profile');
      }

      // Use the newly created profile's ID
      await verifyStatement(statement, profile.id);
    } catch (error) {
      console.error('Error creating beta tester profile:', error);
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