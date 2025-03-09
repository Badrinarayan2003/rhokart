import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";


import authReducer from "../reducers/authSlice";
import registrationReducer from "../reducers/registrationSlice";

// Define persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "registration"], // Only persist auth state, not everything
};

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    registration: registrationReducer,
});

// Wrap reducer with persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST"], // Ignore the action causing the warning
                ignoredPaths: ["register", "rehydrate"], // Ignore non-serializable fields in Redux Persist
            },
        }),
});

// Create persistor
const persistor = persistStore(store);

export { store, persistor };