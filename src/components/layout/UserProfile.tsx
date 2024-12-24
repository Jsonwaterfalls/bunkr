import { Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserProfileProps {
  profile: any;
  onUpdateUsername: (event: React.FormEvent<HTMLFormElement>) => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export const UserProfile = ({
  profile,
  onUpdateUsername,
  onAvatarUpload,
  uploading,
}: UserProfileProps) => {
  return (
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
  );
};