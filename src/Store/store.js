/*
Creating persisted store
*/
// Imports
import storage from "redux-persist/lib/storage";
import {configureStore, combineReducers} from '@reduxjs/toolkit'
import { rootReducer } from "./rootReducer";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootreducer = combineReducers({root: rootReducer})
const persistedReducer = persistReducer(persistConfig, rootreducer);

// Configure redux store for persisted store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
