// Import
import { createReducer } from "@reduxjs/toolkit";

// Create reducer for redux store
export const rootReducer = createReducer(
  { isAuthenticated: false, user: {}, isAdmin: false },
  {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.user;
      state.isAdmin = action.user.userData[0].isAdmin;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {};
      state.isAdmin = false;
    },
  }
);
