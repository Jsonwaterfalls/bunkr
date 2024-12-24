import { Card } from "../ui/card";

export const PostLoadingSkeleton = () => {
  return (
    <Card className="w-full animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg"></div>
    </Card>
  );
};