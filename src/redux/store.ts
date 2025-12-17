import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import featureTreeReducer from "./slices/featureTreeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    featureTree: featureTreeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
