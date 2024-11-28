import { createSlice } from "@reduxjs/toolkit";
import { ConfirmationState } from "@/d";
import {
  fetchConfirmation,
  fetchConfirmations,
} from "@/redux/confirmations/operations";

const initialState: ConfirmationState = {
  isLoading: false,
  isUpdateLoading: false,
  isLoadingConfirmations: false,
  foundConfirmation: null,
  confirmations: [],
  error: null,
};

const confirmationsSlice = createSlice({
  name: "confirmations",
  initialState,
  reducers: {
    clearFoundConfirmation(state) {
      state.foundConfirmation = null;
    },
    clearConfirmations(state) {
      state.confirmations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfirmations.pending, (state) => {
        state.isLoadingConfirmations = true;
      })
      .addCase(fetchConfirmations.fulfilled, (state, { payload }) => {
        state.isLoadingConfirmations = false;
        state.error = null;
        state.confirmations = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchConfirmations.rejected, (state, { payload }) => {
        state.isLoadingConfirmations = false;
        state.error = payload;
      })
      .addCase(fetchConfirmation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConfirmation.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.foundConfirmation = payload.data;
      })
      .addCase(fetchConfirmation.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearFoundConfirmation, clearConfirmations } =
  confirmationsSlice.actions;
export default confirmationsSlice.reducer;
