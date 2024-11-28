import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import {
  BasicPagination,
  FetchReceiptResponse,
  FetchReceiptsResponse,
} from "@/d";

export const fetchReceipts = createAsyncThunk<
  FetchReceiptsResponse,
  BasicPagination
>("fetchReceipts", async ({ page, limit }, { rejectWithValue }) => {
  const url = `api/receipts?page=${page}&limit=${limit}`;

  try {
    const response: AxiosResponse<FetchReceiptsResponse> = await axios.get(url);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchReceipt = createAsyncThunk<FetchReceiptResponse, string>(
  "fetchReceipt",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`api/receipts/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
