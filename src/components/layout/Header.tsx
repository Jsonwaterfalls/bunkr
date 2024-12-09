import { Link } from "react-router-dom";
import { LogOut, Upload, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  profile: any;
  session: any;
  onUpdateUsername: (event: React.FormEvent<HTMLFormElement>) => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export const Header = ({
  profile,
  session,
  onUpdateUsername,
  onAvatarUpload,
  uploading,
}: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full mb-8 flex justify-center">
        <img 
          src="/lovable-uploads/bbbcc199-7eed-436a-864f-91dc9f0a1df4.png" 
          alt="BUNKr Logo" 
          className="h-12 md:h-16"
        />
      </div>
      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={
                  profile?.avatar_url
                    ? `https://rwmfoqgrvinrcxkjtzdz.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
                    : undefined
                }
              />
              <AvatarFallback>
                {profile?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/80 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <form onSubmit={onUpdateUsername} className="flex gap-2">
            <Input
              name="username"
              placeholder="Update username"
              defaultValue={profile?.username || ""}
              className="max-w-[200px]"
            />
            <Button type="submit" size="sm">
              Update
            </Button>
          </form>
        </div>
        <div className="flex items-center gap-2 justify-center md:justify-end">
          <NotificationsPopover />
          <Link to={`/profile/${session?.user.id}`}>
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
      </div>
    </div>
  );
};