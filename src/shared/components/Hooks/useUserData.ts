// hooks/useUserData.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { checkAuthStatus } from '@/store/authThunks';

export const useUserData = () => {
  const dispatch = useAppDispatch();
  const {
    user,
    token,
    isLoggedIn,
    isLoading,
    error,
    isWebSocketConnected
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return {
    userData: user,
    token,
    isLoggedIn,
    isLoading,
    error,
    isConnected: isWebSocketConnected
  };
};