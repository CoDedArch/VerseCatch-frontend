// hooks/useUserData.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { initWebSocketConnection } from "@/store/authThunks";

export const useUserData = () => {
  const dispatch = useAppDispatch();
  const {
    user,
    token,
    isLoggedIn,
    isLoading,
    error,
    isWebSocketConnected,
    isAnonymous,
    tokenExpiry, // Make sure this is included in your Redux state
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (token && isLoggedIn) {
      const promise = dispatch(initWebSocketConnection(token));

      return () => {
        promise.abort();
      };
    }
  }, [dispatch, token, isLoggedIn]);

  return {
    userData: user,
    token,
    isLoggedIn,
    isAnonymous,
    isLoading,
    tokenExpiry,
    error,
    isConnected: isWebSocketConnected,
  };
};
