// store/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { UserData } from "@/shared/constants/interfaceConstants";
import { setWebSocketStatus } from "./userSlice";

import {
  loginStart,
  loginSuccess,
  loginFailure,
  setUserData,
  logout,
} from "./userSlice";
import { LOGIN_URL } from "@/shared/constants/urlConstants";

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { dispatch }
  ) => {
    dispatch(loginStart());

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.access_token,
        })
      );

      // Initialize WebSocket connection after successful login
      dispatch(initWebSocketConnection(data.access_token));

      return data.user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }
);

export const initWebSocketConnection = createAsyncThunk(
  "user/initWebSocket",
  async (token: string, { dispatch }) => {
    const API_KEY = import.meta.env.VITE_API_KEY;

    return new Promise<UserData>((resolve, reject) => {
      const ws = new WebSocket(
        `ws://127.0.0.1:8000/ws/auth/me?api_key=${API_KEY}`
      );

      ws.onopen = () => {
        console.log("WebSocket connected to /auth/me");
        ws.send(token);
        // Immediately dispatch that we're connected
        dispatch(setWebSocketStatus(true));
      };

      ws.onmessage = (event) => {
        try {
          const userData = JSON.parse(event.data);
          // Ensure we have minimum required fields
          const completeUserData = {
            ...userData,
            // Add fallbacks for required fields
            email: userData.email || "anonymous",
            username: userData.username || "anonymous",
            isAnonymous: !!userData.isAnonymous,
          };
          dispatch(setUserData(completeUserData));
          resolve(completeUserData);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          reject(error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        dispatch(setWebSocketStatus(false));
        reject(error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected from /auth/me");
        dispatch(setWebSocketStatus(false));
        // Don't logout immediately on close - might be temporary
      };

      // Add cleanup function
      return () => {
        ws.close();
      };
    });
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    dispatch(logout());
    // Add any additional cleanup logic here if needed
  }
);

export const checkAuthStatus = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch, getState }) => {
    const { token, isLoggedIn } = (getState() as RootState).user;
    
    if (token && isLoggedIn) {
      try {
        // Wait for WebSocket to connect and get user data
        const userData = await dispatch(initWebSocketConnection(token)).unwrap();
        
        // If we still don't have user data after WS connection, throw
        if (!userData) {
          throw new Error('Failed to get user data via WebSocket');
        }
        
        return userData;
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        // Don't logout immediately - might be temporary connection issue
        throw error;
      }
    }
    return null;
  }
);