import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isResetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/app`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
        setIsResetMode(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signInEmail">Email</Label>
        <Input
          id="signInEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      {!isResetMode && (
        <div className="space-y-2">
          <Label htmlFor="signInPassword">Password</Label>
          <Input
            id="signInPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading 
          ? (isResetMode ? "Sending reset link..." : "Signing in...") 
          : (isResetMode ? "Send reset link" : "Sign In")}
      </Button>

      <button
        type="button"
        onClick={() => setIsResetMode(!isResetMode)}
        className="text-sm text-blue-500 hover:underline w-full text-center mt-2"
      >
        {isResetMode 
          ? "Back to sign in" 
          : "Forgot your password?"}
      </button>
    </form>
  );
};

export default SignInForm;