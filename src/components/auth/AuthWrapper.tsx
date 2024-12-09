import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "./AuthForm";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full flex justify-center mb-8">
          <img 
            src="/lovable-uploads/bbbcc199-7eed-436a-864f-91dc9f0a1df4.png" 
            alt="BUNKr Logo" 
            className="h-12 md:h-16"
          />
        </div>
        <AuthForm />
      </div>
    );
  }

  return <>{children}</>;
};