import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthenticateState } from "@/d";
import {
  login,
  fetchProfile,
  updateProfile,
  fetchUsers,
  fetchUser,
  createUser,
} from "@/redux/authenticate/operations";
import { CookiesApi } from "@/utils";

const initialState: AuthenticateState = {
  isLoggedIn: true,
  isLoading: false,
  isCreating: false,
  isUpdateLoading: false,
  isRefreshing: true,
  isLoadingUsers: false,
  user: null,
  foundUser: null,
  users: [],
  tokens: null,
  error: null,
};

const authSlice = createSlice({
  name: "authenticate",
  initialState,
  reducers: {
    clearFoundUser(state) {
      state.foundUser = null;
    },
    clearUsers(state) {
      state.users = [];
    },
    logout(state) {
      state.isLoggedIn = false;
      CookiesApi.setValue("refreshToken", null);
      state.tokens = null;
      state.user = null;
      axios.defaults.headers.common.Authorization = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(register.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(register.fulfilled, (state, { payload }) => {
      //   state.isLoading = false;
      //   state.error = null;
      //   state.tokens = payload.tokens;
      //   state.user = payload.data;
      //   state.isLoggedIn = true;
      // })
      // .addCase(register.rejected, (state) => {
      //   state.isLoading = false;
      //   state.user = null;
      //   state.isLoggedIn = false;
      // })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.tokens = payload.tokens;
        state.user = payload.data;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.tokens = null;
        state.isLoggedIn = false;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.isRefreshing = false;
        state.error = null;
        // state.tokens = payload.tokens;
        state.user = payload.data;
        state.isLoggedIn = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isRefreshing = false;
        state.tokens = null;
        state.isLoggedIn = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isUpdateLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.isUpdateLoading = false;
        state.error = null;
        state.user = payload.data;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdateLoading = false;
      })
      .addCase(createUser.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.isCreating = false;
        state.error = null;
        state.users.push(payload.data);
      })
      .addCase(createUser.rejected, (state) => {
        state.isCreating = false;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.isLoadingUsers = true;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.isLoadingUsers = false;
        state.error = null;
        state.users = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.isLoadingUsers = false;
        state.error = payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.foundUser = payload.data;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout, clearFoundUser, clearUsers } = authSlice.actions;
export default authSlice.reducer;
