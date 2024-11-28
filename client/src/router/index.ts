export const AppRoutes = {
  root: "/",
  login: "/login",
  register: "/register",
  account: "/account",
  profile: "/account/profile",
  dashboard: "/",
  sellers: "/sellers",
  receipts: "/receipts",
  confirmations: "/confirmations",
  create: "create",
  edit: "edit",
  notFound: "*",
} as const;

export type RoutesType = (typeof AppRoutes)[keyof typeof AppRoutes];
