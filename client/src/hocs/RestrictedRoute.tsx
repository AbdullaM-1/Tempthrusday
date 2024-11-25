import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useAppState } from "@/hooks";

type RestrictedRouteProps = {
  component: JSX.Element;
  redirectTo: string;
};

export const RestrictedRoute: FC<RestrictedRouteProps> = ({
  component: Component,
  redirectTo = "/",
}) => {
  const { authenticate } = useAppState();

  return authenticate.isLoggedIn ? <Navigate to={redirectTo} /> : Component;
};
