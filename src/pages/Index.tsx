import { useEffect, useState } from "react";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/MainContent";
import { ProfileManager } from "@/components/profile/ProfileManager";

const Index = () => {
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [currentStatement, setCurrentStatement] = useState<string>("");
  const { profile, uploading, handleAvatarUpload, handleUpdateUsername, fetchProfile } = ProfileManager();

  useEffect(() => {
    document.title = "BUNKr";
  }, []);

  const handleVerify = (statement: string, results: any[]) => {
    setCurrentStatement(statement);
    setVerificationResults(results);
  };

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Header
            profile={profile}
            onUpdateUsername={handleUpdateUsername}
            onAvatarUpload={handleAvatarUpload}
            uploading={uploading}
          />
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