export const AppRoutes = {
  root: "/",
  dashboard: "/",
  sellers: "/sellers",
  login: "/login",
  register: "/register",
  account: "/account",
  profile: "/account/profile",
  basicInformation: "basic-information",
  create: "create",
  edit: "edit",
  notFound: "*",
} as const;

export type RoutesType = (typeof AppRoutes)[keyof typeof AppRoutes];
