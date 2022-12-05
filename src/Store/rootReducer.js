import { createReducer } from "@reduxjs/toolkit";

export const rootReducer = createReducer(
  { isAuthenticated: false, user: {} },
  {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.user;
    },
    logout: (state, action) => {
      state.isAuthenticated = false;
      state.user = action.user;
    },
  }
);
