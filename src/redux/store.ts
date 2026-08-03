import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import featureTreeReducer from "./slices/featureTreeSlice";
import personalReducer from "./slices/personalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    featureTree: featureTreeReducer,
    personal: personalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
