import { useState } from "react";
import { MainContent } from "@/components/MainContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/AppSidebar";

const Index = () => {
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [currentStatement, setCurrentStatement] = useState("");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Header session={null} />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1">
            <div className="container py-6">
              <MainContent
                verificationResults={verificationResults}
                currentStatement={currentStatement}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;