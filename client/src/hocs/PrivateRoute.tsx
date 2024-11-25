import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useAppState } from "@/hooks";
import { RoutesType } from "@/router";

type PrivateRouteProps = {
  component: JSX.Element;
  redirectTo: RoutesType;
  role?: "ADMIN" | "USER";
};

export const PrivateRoute: FC<PrivateRouteProps> = ({
  component: Component,
  redirectTo = "/",
  role = "USER",
}) => {
  const { authenticate } = useAppState();
  const shouldRedirect =
    !authenticate.isLoggedIn &&
    !authenticate.isRefreshing &&
    !(authenticate.user?.role === role);

  return shouldRedirect ? <Navigate to={redirectTo} /> : Component;
};
