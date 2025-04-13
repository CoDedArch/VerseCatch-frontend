import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "@/shared/constants/interfaceConstants";
import { AuthState } from "@/shared/constants/interfaceConstants";
import { initWebSocketConnection } from "./authThunks"; // Adjust path as needed

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("access_token"),
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  tokenExpiry: localStorage.getItem("token_expiry")
    ? parseInt(localStorage.getItem("token_expiry")!)
    : null,
  isLoading: false,
  error: null,
  isWebSocketConnected: false,
  isAnonymous: localStorage.getItem("isAnonymous") === "true",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: UserData;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.tokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
      state.isLoading = false;
      state.error = null;

      localStorage.setItem("access_token", action.payload.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token_expiry", state.tokenExpiry.toString());
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isAnonymous = false; // Add this
      state.tokenExpiry = null;
      state.isWebSocketConnected = false;
    
      localStorage.removeItem("access_token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("username");
      localStorage.removeItem("bible_version");
      localStorage.removeItem("isAnonymous");
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    setWebSocketStatus: (state, action: PayloadAction<boolean>) => {
      state.isWebSocketConnected = action.payload;
    },
    anonymousLogin: (state) => {
      state.isAnonymous = true;
      state.isLoggedIn = false; 
      state.user = {
        username: "anonymous",
        isAnonymous: true,
      };
      localStorage.setItem("isAnonymous", "true");
      localStorage.setItem("username", "anonymous");
      localStorage.removeItem("access_token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token_expiry");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initWebSocketConnection.pending, (state) => {
        state.isWebSocketConnected = false;
      })
      .addCase(initWebSocketConnection.fulfilled, (state) => {
        state.isWebSocketConnected = true;
      })
      .addCase(initWebSocketConnection.rejected, (state) => {
        state.isWebSocketConnected = false;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUserData,
  setWebSocketStatus,
  anonymousLogin
} = userSlice.actions;
export default userSlice.reducer;
