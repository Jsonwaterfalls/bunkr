import { useState } from "react";
import { MainContent } from "@/components/MainContent";
import { Sidebar } from "@/components/ui/sidebar";

const Index = () => {
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [currentStatement, setCurrentStatement] = useState("");

  return (
    <div className="container mx-auto py-6 flex gap-6">
      <Sidebar className="w-64" />
      <MainContent
        verificationResults={verificationResults}
        currentStatement={currentStatement}
      />
    </div>
  );
};

export default Index;