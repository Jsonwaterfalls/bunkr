import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerificationForm } from "@/components/VerificationForm";
import { ResultCard } from "@/components/ResultCard";
import { SearchUsers } from "@/components/SearchUsers";
import { TrendingTopics } from "@/components/TrendingTopics";
import { Feed } from "@/components/Feed";

interface MainContentProps {
  verificationResults: any[];
  currentStatement: string;
}

export const MainContent = ({
  verificationResults,
  currentStatement,
}: MainContentProps) => {
  return (
    <div className="w-full space-y-8">
      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verify">My Stuff</TabsTrigger>
          <TabsTrigger value="explore">Explore</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verify" className="space-y-4">
          <VerificationForm />
          {verificationResults.length > 0 && (
            <ResultCard
              statement={currentStatement}
              results={verificationResults}
            />
          )}
        </TabsContent>
        
        <TabsContent value="explore" className="space-y-8">
          <SearchUsers />
          <TrendingTopics />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Verifications</h2>
        <Feed />
      </div>
    </div>
  );
};