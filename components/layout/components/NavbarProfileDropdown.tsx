"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Headset,
  LayoutDashboardIcon,
  LogIn,
  LogOut,
  Settings,
  UserCircle2,
} from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  session: Session | null;
}

const NavbarProfileDropdown = ({ session }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogin = () =>
    router.push(`/api/auth/signin?callbackUrl=${pathname}`);
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="User menu"
          className="rounded-full p-1 hover:bg-gray-200 cursor-pointer"
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="profile"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <>
              {session?.user?.name ? (
                <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                  {session.user.name[0]}
                </span>
              ) : (
                <UserCircle2 className="size-7 text-green-500" />
              )}
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        {session && (
          <DropdownMenuGroup className="px-3 py-2 space-y-0.5">
            <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
              {session?.user?.name}
            </h4>
            <h5 className="text-xs text-gray-500 truncate max-w-[200px] line-clamp-1">
              {session?.user?.email}
            </h5>
          </DropdownMenuGroup>
        )}
        <DropdownMenuLabel className="px-3 py-2">My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          {session ? (
            <>
              {session.user?.role === "ADMIN" && (
                <DropdownMenuItem
                  className="px-3 py-2 cursor-pointer"
                  onClick={() => router.push("/admin")}
                >
                  <LayoutDashboardIcon className="size-5" />
                  Dashboard
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="px-3 py-2 cursor-pointer"
                onClick={() => router.push("/settings")}
              >
                <Settings className="size-5" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="px-3 py-2 cursor-pointer"
                onClick={async () => await signOut()}
              >
                <LogOut className="size-5 text-red-600" />
                <span className="text-red-600">Logout</span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              className="px-3 py-2 cursor-pointer"
              onClick={handleLogin}
            >
              <LogIn className="size-5 text-green-600" />
              <span className="text-green-600">Login</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarProfileDropdown;
