"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings01Icon,
  Logout01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";

const UserDropdown: React.FC = () => {
  const { session, signOut } = useAuth();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserInitials = (email?: string, name?: string) => {
    if (name) {
      const names = name.split(" ");
      return names.length >= 2
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const userEmail = session?.user?.email || "user@example.com";
  const userName = session?.user?.name || "";
  const displayName = userName || userEmail.split("@")[0];
  const userInitials = getUserInitials(userEmail, userName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-800/50 hover:text-gray-700 rounded-lg"
          aria-label="User menu"
        >
          <div className="relative w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
            {!imageError ? (
              <Image
                src={session?.user?.avatar || "/Profile Image AI Assistant.jpg"}
                alt={displayName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span>{userInitials}</span>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-semibold">
              {session?.user?.name && session.user.name !== "NA"
                ? session.user.name
                : "User Name"}
            </span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <HugeiconsIcon icon={UserIcon} className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <HugeiconsIcon icon={Settings01Icon} className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <HugeiconsIcon icon={Logout01Icon} className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
