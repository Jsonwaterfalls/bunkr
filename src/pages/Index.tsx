import { useEffect, useState } from "react";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/MainContent";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [currentStatement, setCurrentStatement] = useState<string>("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    document.title = "BUNKr";

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleVerify = (statement: string, results: any[]) => {
    setCurrentStatement(statement);
    setVerificationResults(results);
  };

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Header session={session} />
          <MainContent
            verificationResults={verificationResults}
            currentStatement={currentStatement}
            onVerify={handleVerify}
          />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Index;