import { configureStore } from "@reduxjs/toolkit";
import personalReducer from "./slices/personalSlice";

export const store = configureStore({
  reducer: {
    personal: personalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
