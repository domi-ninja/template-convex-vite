import { SignOutButton } from "@/lib/auth/SignOutButton";
import { PersonIcon } from "@radix-ui/react-icons";
import { useQuery } from "convex/react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";

export function UserMenu({
  favoriteColor: _favoriteColor,
  children: children,
}: {
  favoriteColor: string | undefined;
  children: ReactNode;
}) {
  const userInfo = useQuery(api.users.getUser);
  console.log("userInfo", userInfo);
  return (
    <div className="flex">
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 text-secondary-foreground btn-secondary">
            {userInfo?.image ?
              <img src={userInfo?.image} alt="User" className="w-6 h-6 rounded-full" /> :
              <PersonIcon className="h-4 w-4" />
            }
            <span className="">
              {userInfo?.email || userInfo?.name}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {/* <DarkModeToggle /> */}
          </DropdownMenuLabel>
          <DropdownMenuLabel>{children}</DropdownMenuLabel>
          {/* {favoriteColor !== undefined && (
            <DropdownMenuLabel className="flex items-center">
              Favorite color:
              <div
                style={{ backgroundColor: favoriteColor }}
                className="inline-block ml-1 w-5 h-5 border border-gray-800 rounded-sm"
              >
                &nbsp;
              </div>
            </DropdownMenuLabel>
          )} */}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer flex items-center">
              <PersonIcon className="h-4 w-4 mr-2" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem className="flex items-center gap-2 py-2">
            <span>Theme</span>
            <ThemeToggle />
          </DropdownMenuItem>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem asChild>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
