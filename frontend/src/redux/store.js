import { configureStore, combineReducers } from "@reduxjs/toolkit"; // Combined import
import authSlice from "./authSlice";
import clubSlice from "./clubSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combine all reducers into rootReducer
const rootReducer = combineReducers({
  auth: authSlice,
  club: clubSlice,
  company: companySlice,
  application: applicationSlice
});

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
export const persistor = persistStore(store); // Export persistor for persistence
