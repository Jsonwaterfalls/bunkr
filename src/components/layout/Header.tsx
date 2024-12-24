import { Logo } from "./Logo";
import { UserProfile } from "./UserProfile";
import { UserActions } from "./UserActions";

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
  return (
    <div className="w-full flex flex-col items-center">
      <Logo />
      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <UserProfile
          profile={profile}
          onUpdateUsername={onUpdateUsername}
          onAvatarUpload={onAvatarUpload}
          uploading={uploading}
        />
        <UserActions userId={session?.user.id} />
      </div>
    </div>
  );
};