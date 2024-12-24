import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";

interface ReactionButtonProps {
  icon: LucideIcon;
  count: number;
  isActive: boolean;
  activeColor: string;
  onClick: () => void;
}

export const ReactionButton = ({
  icon: Icon,
  count,
  isActive,
  activeColor,
  onClick,
}: ReactionButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-2 ${isActive ? activeColor : ""}`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span>{count}</span>
    </Button>
  );
};