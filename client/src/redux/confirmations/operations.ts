import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import {
  BasicPagination,
  ConfirmationResponse,
  CreateConfirmationValues,
  ConfirmationsResponse,
  UpdateConfirmationValues,
} from "@/d";
import { getErrorMessage } from "@/utils";

export const createConfirmation = createAsyncThunk<
  ConfirmationResponse,
  CreateConfirmationValues
>("createConfirmation", async (createConfirmation, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ConfirmationResponse> = await axios.post(
      "api/confirmations",
      createConfirmation
    );

    toast.success("Confirmation created successfuly!");

    return response.data;
  } catch (error: any) {
    toast.error(getErrorMessage(error.response?.data.error.message));
    return rejectWithValue(error);
  }
});

export const fetchConfirmations = createAsyncThunk<
  ConfirmationsResponse,
  BasicPagination
>("fetchConfirmations", async ({ page, limit }, { rejectWithValue }) => {
  const url = `api/confirmations?page=${page}&limit=${limit}`;

  try {
    const response: AxiosResponse<ConfirmationsResponse> = await axios.get(url);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchConfirmation = createAsyncThunk<ConfirmationResponse, string>(
  "fetchConfirmation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`api/confirmations/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateConfirmation = createAsyncThunk<
  ConfirmationResponse,
  UpdateConfirmationValues
>("updateConfirmation", async (confirmation, { rejectWithValue }) => {
  try {
    const { _id, ...rest } = confirmation;
    const response = await axios.patch(`api/confirmations/${_id}`, rest);
    toast.success("Confirmation updated successfuly!");

    return response.data;
  } catch (error: any) {
    toast.error(getErrorMessage(error.response?.data.error.message));
    return rejectWithValue(error);
  }
});

export const deleteConfirmation = createAsyncThunk<void, string>(
  "deleteConfirmation",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`api/confirmation/${id}`);
      toast.success("Confirmation deleted successfuly!");
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
