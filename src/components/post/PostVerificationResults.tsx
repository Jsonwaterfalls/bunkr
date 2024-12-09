import { VerificationResult } from "@/types/post";

interface PostVerificationResultsProps {
  results: VerificationResult[];
}

export const PostVerificationResults = ({ results }: PostVerificationResultsProps) => {
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

  return (
    <div className="space-y-2">
      {results?.map((result, index) => (
        <div
          key={index}
          className="rounded-lg bg-muted/50 p-3 text-sm space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{result.model}</span>
            <span className={getVerdictColor(result.verdict)}>
              {result.verdict.toUpperCase()} ({result.confidence}%)
            </span>
          </div>
          <p className="text-muted-foreground">{result.reasoning}</p>
        </div>
      ))}
    </div>
  );
};