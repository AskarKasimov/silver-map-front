import { configureStore } from '@reduxjs/toolkit';
import { projectAPI } from './API/projectAPI.api';
import pickedMarkReducer from './pickedMark.ts';
import pickedPoetReducer from './pickedPoet.ts';

export const store = configureStore({
  reducer: {
    [projectAPI.reducerPath]: projectAPI.reducer,
    pickedMark: pickedMarkReducer,
    pickedPoet: pickedPoetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectAPI.middleware),
  devTools: false,
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
