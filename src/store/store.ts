import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import uiReducer from "./uiSlice"
import greetingsReducer from "./greetingsSlice"
import themeReducer from "./themeSlice";
import userReducer from "./userSlice"
import tourReducer from './tourSlice';

export const store = configureStore({
  reducer: { theme: themeReducer, user: userReducer, greetings: greetingsReducer,  ui: uiReducer, tour: tourReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;