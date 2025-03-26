import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Ensure this path is correct

const store = configureStore({
  reducer: {
    user: userReducer, // Manages user authentication state
  },
});

export default store;
