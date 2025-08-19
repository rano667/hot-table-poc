import { configureStore } from "@reduxjs/toolkit";
import validateReducer from "./validateSlice";

export const store = configureStore({
  reducer: {
    validate: validateReducer,
  },
});
