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

export interface FetchReceiptResponse extends BasicResponse<Receipt> {}

export interface FetchReceiptsResponse extends BasicResponse<Receipt[]> {}

export interface CreateConfirmationResponse
  extends BasicResponse<Confirmation> {}

export interface FetchConfirmationResponse
  extends BasicResponse<Confirmation> {}

export interface FetchConfirmationsResponse
  extends BasicResponse<Confirmation[]> {}

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

export interface ReceiptState extends BasicState {
  isUpdateLoading: boolean;
  isLoadingReceipts: boolean;
  foundReceipt: Receipt | null;
  receipts: Receipt[];
}

export type Receipt = {
  _id: string;
  senderName: string;
  amount: number;
  date: string;
  confirmation: string;
  memo?: string | null;
  associatedRecipient: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface ConfirmationState extends BasicState {
  isUpdateLoading: boolean;
  isLoadingConfirmations: boolean;
  foundConfirmation: Confirmation | null;
  confirmations: Confirmation[];
}

export type Confirmation = {
  _id: string;
  user: Pick<User, "_id" | "username" | "name" | "email" | "phone">;
  confirmation: string;
  associatedReceipt: { _id: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateConfirmationValues = Pick<Confirmation, "confirmation">;
