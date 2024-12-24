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

  return (
    <div className="space-y-2">
      {results?.map((result, index) => (
        <div
          key={index}
          className={`rounded-lg p-4 space-y-2 ${getVerdictBgColor(result.verdict)}`}
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
    </div>
  );
};