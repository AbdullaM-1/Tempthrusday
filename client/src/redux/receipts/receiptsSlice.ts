import { createSlice } from "@reduxjs/toolkit";
import { ReceiptState } from "@/d";
import { fetchReceipt, fetchReceipts } from "@/redux/receipts/operations";

const initialState: ReceiptState = {
  isLoading: false,
  isUpdateLoading: false,
  isLoadingReceipts: false,
  foundReceipt: null,
  receipts: [],
  error: null,
};

const receiptsSlice = createSlice({
  name: "receipts",
  initialState,
  reducers: {
    clearFoundReceipt(state) {
      state.foundReceipt = null;
    },
    clearReceipts(state) {
      state.receipts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceipts.pending, (state) => {
        state.isLoadingReceipts = true;
      })
      .addCase(fetchReceipts.fulfilled, (state, { payload }) => {
        state.isLoadingReceipts = false;
        state.error = null;
        state.receipts = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchReceipts.rejected, (state, { payload }) => {
        state.isLoadingReceipts = false;
        state.error = payload;
      })
      .addCase(fetchReceipt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReceipt.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.foundReceipt = payload.data;
      })
      .addCase(fetchReceipt.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearFoundReceipt, clearReceipts } = receiptsSlice.actions;
export default receiptsSlice.reducer;
