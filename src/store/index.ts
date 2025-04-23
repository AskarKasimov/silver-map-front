import { configureStore } from '@reduxjs/toolkit';
import { projectAPI } from './API/projectAPI.api';

export const store = configureStore({
  reducer: {
    [projectAPI.reducerPath]: projectAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectAPI.middleware),
  devTools: false,
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
