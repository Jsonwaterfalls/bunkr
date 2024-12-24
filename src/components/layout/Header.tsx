import { Logo } from "./Logo";
import { UserActions } from "./UserActions";

interface HeaderProps {
  session: any;
}

export const Header = ({ session }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col items-center">
      <Logo />
      <div className="w-full flex justify-end items-center">
        <UserActions userId={session?.user.id} />
      </div>
    </div>
  );
};