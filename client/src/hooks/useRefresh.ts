import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { refresh } from "../redux/store";

export const useRefresh = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refresh());
  }, [dispatch]);
};
