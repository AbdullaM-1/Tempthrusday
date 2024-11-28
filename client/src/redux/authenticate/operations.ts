import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import {
  BasicPagination,
  CreateUserValues,
  UsersResponse,
  LogInValues,
  LoginResponse,
  Tokens,
  UserResponse,
  UpdateUserValues,
  User,
  UserUpdateValuesForUser,
} from "@/d";
import { CookiesApi, getErrorMessage } from "@/utils";
import { AppState } from "@/redux/store";

const setAuthHeader = (token: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

// export const register = createAsyncThunk<LoginResponse, RegisterValues>(
//   "register",
//   async (info, { rejectWithValue }) => {
//     try {
//       const response: AxiosResponse<LoginResponse> = await axios.post(
//         "api/auth/register",
//         info
//       );

//       setAuthHeader(response.data.tokens.accessToken);

//       CookiesApi.setValue("accessToken", response.data.tokens.accessToken);

//       toast.success("Register Success!");

//       return response.data;
//     } catch (error: any) {
//       toast.error(getErrorMessage(error.response?.data.error.message));
//       return rejectWithValue(error);
//     }
//   }
// );

export const login = createAsyncThunk<
  LoginResponse,
  LogInValues | { tokens: Tokens; user: User }
>("login", async (data, { rejectWithValue }) => {
  try {
    let response: AxiosResponse<LoginResponse> = await axios.post(
      "api/auth/login",
      data
    );

    setAuthHeader(response.data.tokens.accessToken);

    CookiesApi.setValue("accessToken", response.data.tokens.accessToken);

    toast.success("Login Success!");

    return response.data;
  } catch (error: any) {
    console.error(error);
    toast.error(getErrorMessage(error.response?.data.error.message));
    return rejectWithValue(error);
  }
});

export const fetchProfile = createAsyncThunk<UserResponse>(
  "profile",
  async (_, { rejectWithValue, getState }) => {
    const { authenticate } = getState() as AppState;

    const accessToken = CookiesApi.getValue("accessToken");

    if (accessToken === undefined) return rejectWithValue(authenticate);

    setAuthHeader(accessToken);

    try {
      const response: AxiosResponse<UserResponse> = await axios.get(
        "api/users/profile"
      );

      // CookiesApi.setValue("accessToken", response.data.tokens.accessToken);
      // setAuthHeader(response.data.tokens.accessToken);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(authenticate);
    }
  }
);

export const updateProfile = createAsyncThunk<
  UserResponse,
  UserUpdateValuesForUser
>("updateProfile", async (updateUser, { rejectWithValue }) => {
  try {
    const { confirmPassword, ...rest } = updateUser;

    const formData = new FormData();
    Object.keys(rest).forEach((key) => {
      const value = updateUser[key as keyof UserUpdateValuesForUser];
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    const response: AxiosResponse<UserResponse> = await axios.patch(
      `api/users/profile`,
      formData
    );

    toast.success("Personal info updated successfuly!");

    return response.data;
  } catch (error: any) {
    toast.error(getErrorMessage(error.response?.data.error.message));
    return rejectWithValue(error);
  }
});

// -------------------------------- Admin Actions --------------------------------
export const createUser = createAsyncThunk<UserResponse, CreateUserValues>(
  "createUser",
  async (createUser, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<UserResponse> = await axios.post(
        "api/users",
        createUser
      );

      toast.success("User created successfuly!");

      return response.data;
    } catch (error: any) {
      toast.error(getErrorMessage(error.response?.data.error.message));
      return rejectWithValue(error);
    }
  }
);

export const fetchUsers = createAsyncThunk<UsersResponse, BasicPagination>(
  "fetchUsers",
  async ({ page, limit }, { rejectWithValue }) => {
    const url = `api/users?page=${page}&limit=${limit}`;

    try {
      const response: AxiosResponse<UsersResponse> = await axios.get(url);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUser = createAsyncThunk<UserResponse, string>(
  "fetchUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`api/users/${id}`);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk<UserResponse, UpdateUserValues>(
  "updateUser",
  async (user, { rejectWithValue }) => {
    try {
      const { _id, ...rest } = user;
      const response = await axios.patch(`api/users/${_id}`, rest);
      toast.success("User updated successfuly!");

      return response.data;
    } catch (error: any) {
      toast.error(getErrorMessage(error.response?.data.error.message));
      return rejectWithValue(error);
    }
  }
);

export const deleteUser = createAsyncThunk<void, string>(
  "deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`api/users/${id}`);
      toast.success("User deleted successfuly!");
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
