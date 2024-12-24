import { useState } from "react";
import { MainContent } from "@/components/MainContent";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [currentStatement, setCurrentStatement] = useState("");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64" />
        <main className="flex-1">
          <div className="container py-6">
            <MainContent
              verificationResults={verificationResults}
              currentStatement={currentStatement}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;