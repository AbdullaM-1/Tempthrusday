import { AppState } from "@/redux/store";

export const selectAuthenticate = (state: AppState) => state.authenticate;

export const selectReceipts = (state: AppState) => state.receipts;

export const selectConfirmations = (state: AppState) => state.confirmations;

export const selectSaveNavigation = (state: AppState) => state.saveNavigation;
