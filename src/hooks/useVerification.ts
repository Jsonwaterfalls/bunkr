import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseVerificationResult {
  isVerifying: boolean;
  verifyStatement: (statement: string) => Promise<void>;
}

export const useVerification = (
  onVerify: (statement: string, results: any[]) => void
): UseVerificationResult => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const verifyStatement = async (statement: string) => {
    if (!statement.trim()) {
      toast({
        title: "Error",
        description: "Please enter a statement to verify",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Call verification function
      const { data, error } = await supabase.functions.invoke('verify-statement', {
        body: { statement: statement.trim() }
      });

      if (error) {
        console.error('Verification error:', error);
        throw error;
      }
      
      onVerify(statement, data.results);
      
      toast({
        title: "Success",
        description: "Your statement has been verified",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to verify statement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return { isVerifying, verifyStatement };
};