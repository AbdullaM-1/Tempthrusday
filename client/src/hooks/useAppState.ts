import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import {
  selectAuthenticate,
  selectSaveNavigation,
  selectReceipts,
  selectConfirmations,
} from "@/redux/selectors";

export const useAppState = (): AppState => ({
  authenticate: useSelector(selectAuthenticate),
  receipts: useSelector(selectReceipts),
  confirmations: useSelector(selectConfirmations),
  saveNavigation: useSelector(selectSaveNavigation),
});
