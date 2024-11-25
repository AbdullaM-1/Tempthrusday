import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SaveNavigationState } from "@/d";

const initialState: SaveNavigationState = {
  saveRoute: "",
  haveModal: false,
};

const saveNavigationSlice = createSlice({
  name: "saveNavigation",
  initialState,
  reducers: {
    setRoute(state, { payload }: PayloadAction<SaveNavigationState>) {
      state.saveRoute = payload.saveRoute;
      state.haveModal = payload.haveModal;
    },
  },
});

export const { setRoute } = saveNavigationSlice.actions;
export default saveNavigationSlice.reducer;
