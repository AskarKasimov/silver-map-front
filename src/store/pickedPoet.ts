import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPoet } from './API/models.api.ts';

interface PickedPoetState {
  pickedPoet: IPoet | null;
}

const initialState: PickedPoetState = {
  pickedPoet: null,
};

const pickedPoetSlice = createSlice({
  name: 'pickedPoet',
  initialState,
  reducers: {
    setPickedPoet(state, action: PayloadAction<IPoet | null>) {
      state.pickedPoet = action.payload;
    },
  },
});

export const { setPickedPoet } = pickedPoetSlice.actions;
export default pickedPoetSlice.reducer;
