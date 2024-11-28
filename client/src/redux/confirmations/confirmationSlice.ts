import { createSlice } from "@reduxjs/toolkit";
import { ConfirmationState } from "@/d";
import {
  createConfirmation,
  fetchConfirmation,
  fetchConfirmations,
  updateConfirmation,
} from "@/redux/confirmations/operations";

const initialState: ConfirmationState = {
  isCreating: false,
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
      .addCase(createConfirmation.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createConfirmation.fulfilled, (state, { payload }) => {
        state.isCreating = false;
        state.error = null;
        state.confirmations.push(payload.data);
      })
      .addCase(createConfirmation.rejected, (state) => {
        state.isCreating = false;
      })
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
      })
      .addCase(updateConfirmation.fulfilled, (state, { payload }) => {
        state.isUpdateLoading = false;
        state.error = null;
        state.confirmations.forEach((confirmation, index) => {
          if (confirmation._id === payload.data._id) {
            state.confirmations[index] = payload.data;
          }
        });
        state.foundConfirmation = payload.data;
      })
      .addCase(updateConfirmation.rejected, (state, { payload }) => {
        state.isUpdateLoading = false;
        state.error = payload;
      });
  },
});

export const { clearFoundConfirmation, clearConfirmations } =
  confirmationsSlice.actions;
export default confirmationsSlice.reducer;
