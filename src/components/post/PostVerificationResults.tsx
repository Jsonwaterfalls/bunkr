import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VerificationResult {
  verdict: string;
  confidence: number;
  reasoning: string;
  model: string;
}

interface PostVerificationResultsProps {
  results: VerificationResult[];
}

export const PostVerificationResults = ({ results }: PostVerificationResultsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getVerdictColor = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case "true":
        return "text-green-600";
      case "false":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getVerdictBgColor = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case "true":
        return "bg-green-50";
      case "false":
        return "bg-red-50";
      default:
        return "bg-yellow-50";
    }
  };

  // Get the latest verification result
  const latestResult = results[0];
  const isTrue = latestResult?.verdict.toLowerCase() === "true";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            {isTrue ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={getVerdictColor(latestResult.verdict)}>
              Verified {latestResult.verdict.toUpperCase()} ({latestResult.confidence}% confident)
            </span>
          </div>
          <ChevronDown 
            className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 space-y-2 mt-2 ${getVerdictBgColor(result.verdict)}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{result.model}</span>
              <span className={`font-semibold ${getVerdictColor(result.verdict)}`}>
                {result.verdict.toUpperCase()} ({result.confidence}% confident)
              </span>
            </div>
            <p className="text-gray-600">{result.reasoning}</p>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};