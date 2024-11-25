import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import axios from "axios";

import authenticateReducer, {
  logout,
  clearFoundUser,
  clearUsers,
} from "@/redux/authenticate/authSlice";
import {
  login,
  fetchProfile,
  updateProfile,
  createUser,
  fetchUsers,
  fetchUser,
} from "@/redux/authenticate/operations";
import saveNavigationReducer, {
  setRoute,
} from "./saveNavigation/saveNavigationSlice";

const { VITE_APP_BASE_URL } = import.meta.env;

axios.defaults.baseURL = `${VITE_APP_BASE_URL}`;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["saveRoute", "isLoggedIn"],
};

const reducer = combineReducers({
  authenticate: persistReducer(persistConfig, authenticateReducer),
  saveNavigation: persistReducer(persistConfig, saveNavigationReducer),
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
  login,
  fetchProfile as refresh,
  logout,
  clearFoundUser,
  clearUsers,
  updateProfile,
  createUser,
  fetchUser,
  fetchUsers,
  setRoute,
};
