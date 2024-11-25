import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFirstLetterOfUserName } from "@/utils";
import { useAppDispatch, useAppState } from "@/hooks";
import { logout } from "@/redux/store";
import { Link } from "react-router-dom";
import { AppRoutes } from "@/router";

interface HeaderProps {}

const { VITE_APP_BASE_URL } = import.meta.env;

export const Header: FC<HeaderProps> = () => {
  const { authenticate } = useAppState();
  const dispath = useAppDispatch();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Zelle Project</div>

        {authenticate.isLoggedIn && authenticate.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={`${VITE_APP_BASE_URL}/api/${authenticate.user.avatar}`}
                />
                <AvatarFallback>
                  {getFirstLetterOfUserName(authenticate.user?.name)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                Signed in as <br /> @{authenticate.user.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={AppRoutes.profile}>Profile</Link>
              </DropdownMenuItem>
              {authenticate.user.role === "ADMIN" && (
                <>
                  <DropdownMenuItem>
                    <Link to={AppRoutes.sellers}>Sellers</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => dispath(logout())}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button>
            <Link to={AppRoutes.login}>Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
