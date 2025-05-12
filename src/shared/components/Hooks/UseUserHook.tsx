import { useState, useEffect, useRef } from "react";
import { UserData } from "../../constants/interfaceConstants";

const useUserDataHook = (): {
  userData: UserData | null;
  isConnected: boolean;
} => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }
    const API_KEY = import.meta.env.VITE_API_KEY;
    const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL!;

    // Establish WebSocket connection
    const ws = new WebSocket(
      `${WS_BASE_URL}/ws/auth/me?api_key=${API_KEY}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected to /auth/me");
      socketRef.current = ws;
      ws.send(token);
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
      try {
        const data = JSON.parse(event.data);
        setUserData(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected from /auth/me");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return {
    userData,
    isConnected: socketRef.current?.readyState === WebSocket.OPEN,
  };
};

export default useUserDataHook;
