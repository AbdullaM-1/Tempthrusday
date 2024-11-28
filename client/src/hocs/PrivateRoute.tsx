import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useAppState } from "@/hooks";
import { RoutesType } from "@/router";

type PrivateRouteProps = {
  component: JSX.Element;
  redirectTo: RoutesType;
  role: "ADMIN" | "USER" | "";
};

export const PrivateRoute: FC<PrivateRouteProps> = ({
  component: Component,
  redirectTo = "/",
  role = "",
}) => {
  const { authenticate } = useAppState();
  
  // Determine if the user should be redirected
  const shouldRedirect =
    !authenticate.isLoggedIn ||  // If the user is not logged in
    (role && authenticate.user?.role !== role) ||  // If role is provided and doesn't match
    (!authenticate.isRefreshing && !authenticate.user?.role);  // If the user is refreshing and no role is set

  return shouldRedirect ? <Navigate to={redirectTo} /> : Component;
};
