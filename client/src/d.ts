export type Meta = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  page: string;
  pageCount: number;
  limit: string;
};

interface BasicResponse<T> {
  status: string;
  data: T;
  meta?: Meta;
  error?: string;
}

export interface BasicPagination {
  page: number;
  limit: number;
}

export interface LoginResponse extends BasicResponse<User> {
  tokens: Tokens;
}

export interface UpdateProfileResponse extends BasicResponse<User> {}

export interface UpdateUserResponse extends BasicResponse<User> {}

export interface CreateUserResponse extends BasicResponse<User> {}

export interface FetchUserResponse extends BasicResponse<User> {}

export interface FetchUsersResponse extends BasicResponse<User[]> {}

interface BasicState {
  isLoading: boolean;
  error: unknown;
  meta?: Meta | null;
}

export interface AuthenticateState extends BasicState {
  isLoggedIn: boolean;
  isUpdateLoading: boolean;
  isCreating: boolean;
  isRefreshing: boolean;
  isLoadingUsers: boolean;
  foundUser: User | null;
  user: User | null;
  users: User[];
  tokens: Tokens | null;
}

export type User = {
  _id: string;
  avatar?: string | null;
  username: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserValues = Pick<
  User,
  "username" | "name" | "phone" | "email"
>;

export type LogInValues = {
  emailOrUsername: string;
  password: string;
};

export type UserUpdateValuesForUser = Pick<
  User,
  "name" | "phone" | "address"
> & {
  avatar: File | null;
  password?: string;
  confirmPassword?: string;
  oldPassword?: string;
};

export type UserUpdateValuesForAdmin = {
  password: string;
  newPassword: string;
} & Pick<User, "name" | "email" | "phone">;

export type Tokens = {
  accessToken: string;
};

export type SaveNavigationState = {
  saveRoute: string;
  haveModal?: boolean;
};
