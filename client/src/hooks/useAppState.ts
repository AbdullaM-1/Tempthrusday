import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { selectAuthenticate, selectSaveNavigation } from "@/redux/selectors";

export const useAppState = (): AppState => ({
  authenticate: useSelector(selectAuthenticate),
  saveNavigation: useSelector(selectSaveNavigation),
});
