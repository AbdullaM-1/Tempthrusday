import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import {
  BasicPagination,
  CreateConfirmationResponse,
  CreateConfirmationValues,
  FetchConfirmationResponse,
  FetchConfirmationsResponse,
} from "@/d";
import { getErrorMessage } from "@/utils";

export const createConfirmation = createAsyncThunk<
  CreateConfirmationResponse,
  CreateConfirmationValues
>("createConfirmation", async (createConfirmation, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<CreateConfirmationResponse> =
      await axios.post("api/confirmations", createConfirmation);

    toast.success("Confirmation created successfuly!");

    return response.data;
  } catch (error: any) {
    toast.error(getErrorMessage(error.response?.data.error.message));
    return rejectWithValue(error);
  }
});

export const fetchConfirmations = createAsyncThunk<
  FetchConfirmationsResponse,
  BasicPagination
>("fetchConfirmations", async ({ page, limit }, { rejectWithValue }) => {
  const url = `api/confirmations?page=${page}&limit=${limit}`;

  try {
    const response: AxiosResponse<FetchConfirmationsResponse> = await axios.get(
      url
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchConfirmation = createAsyncThunk<
  FetchConfirmationResponse,
  string
>("fetchConfirmation", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`api/confirmations/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});
