import { createReducer } from "@reduxjs/toolkit";

export const rootReducer = createReducer(
  { isAuthenticated: false, user: {}, isAdmin: false },
  {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.user;
      state.isAdmin = action.user.userData[0].isAdmin;
    },
    logout: (state, action) => {
      state.isAuthenticated = false;
      state.user = action.user;
      state.isAdmin = false;
    },
  }
);
