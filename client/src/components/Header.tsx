'use client'

import { FC } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppState } from "@/hooks"
import { logout } from "@/redux/store"
import { AppRoutes } from "@/router"
import { getFirstLetterOfUserName } from "@/utils"

const { VITE_APP_BASE_URL } = import.meta.env

export const Header: FC = () => {
  const { authenticate } = useAppState()
  const dispatch = useAppDispatch()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex items-center space-x-2">
          <Link 
            to={AppRoutes.UserYTdashboard} 
            className="text-xl font-bold tracking-tight hover:text-primary/90"
          >
            VideoFirm
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {authenticate.isLoggedIn && authenticate.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`${VITE_APP_BASE_URL}/api/${authenticate.user.avatar}`}
                      alt={authenticate.user.name}
                    />
                    <AvatarFallback>
                      {getFirstLetterOfUserName(authenticate.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{authenticate.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{authenticate.user.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={AppRoutes.profile} className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                {authenticate.user.role === "ADMIN" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to={AppRoutes.sellers} className="w-full">
                        Sellers
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={AppRoutes.receipts} className="w-full">
                        Receipts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={AppRoutes.confirmations} className="w-full">
                        Confirmations
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {authenticate.user.role === "USER" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to={AppRoutes.receipts} className="w-full">
                        Receipts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={AppRoutes.confirmations} className="w-full">
                        Confirmations
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to={AppRoutes.login}>Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

