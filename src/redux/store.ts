/* Core */
import {
  configureStore,
  type ThunkAction,
  type Action,
} from "@reduxjs/toolkit";
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  type TypedUseSelectorHook,
} from "react-redux";
import { persistStore, persistReducer, type Persistor, type PersistorAction, FLUSH, REHYDRATE, PERSIST, PURGE, REGISTER, PAUSE } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

/* Instruments */
import { middleware } from "./middleware";
import { rootReducer } from "./rootReducer";
import storage from "./storage";

const rootPersistConfig = {
  key: 'root',
  storage: storage,
}

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const reduxStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middleware)
  },
});

export const persistor: Persistor = persistStore(reduxStore);

export const useDispatch = useReduxDispatch<ReduxDispatch>;
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;

/* Types */
export type ReduxStore = typeof reduxStore;
export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  { persistor: Persistor },
  Action | PersistorAction
>;
