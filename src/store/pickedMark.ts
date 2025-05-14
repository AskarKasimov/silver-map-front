import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMark } from './API/models.api.ts';

interface PickedMarkState {
  pickedMark: IMark | null;
}

const initialState: PickedMarkState = {
  pickedMark: null,
};

const pickedMarkSlice = createSlice({
  name: 'pickedMark',
  initialState,
  reducers: {
    setPickedMark(state, action: PayloadAction<IMark | null>) {
      state.pickedMark = action.payload;
    },
  },
});

export const { setPickedMark } = pickedMarkSlice.actions;
export default pickedMarkSlice.reducer;
