import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save } from "lucide-react";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  isEditing: boolean;
  bio: string;
  setBio: (bio: string) => void;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updateProfileMutation: any;
  setIsEditing: (isEditing: boolean) => void;
  uploading: boolean;
}

export const ProfileHeader = ({
  profile,
  isOwnProfile,
  isEditing,
  bio,
  setBio,
  handleAvatarUpload,
  updateProfileMutation,
  setIsEditing,
  uploading,
}: ProfileHeaderProps) => {
  return (
    <div className="flex items-start gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24">
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
        {isOwnProfile && (
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
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold">{profile?.username}</h1>
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => updateProfileMutation.mutate()}
                disabled={updateProfileMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setBio(profile?.bio || "");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground">
              {profile?.bio || "No bio yet"}
            </p>
            {isOwnProfile && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Bio
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};