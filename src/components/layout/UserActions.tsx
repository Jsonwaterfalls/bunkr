import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserActionsProps {
  userId: string;
}

export const UserActions = ({ userId }: UserActionsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2 justify-center md:justify-end">
      <NotificationsPopover />
      <Link to={`/profile/${userId}`}>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        onClick={() => supabase.auth.signOut()}
        className="text-sm"
      >
        {isMobile ? (
          <LogOut className="h-4 w-4" />
        ) : (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </>
        )}
      </Button>
    </div>
  );
};