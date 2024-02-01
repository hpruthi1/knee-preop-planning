import { configureStore } from "@reduxjs/toolkit";
import landmarkReducer from "./slices/LandmarkSlice";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    landmarks: landmarkReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const def = getDefaultMiddleware();
    def.push(logger);
    return def;
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
