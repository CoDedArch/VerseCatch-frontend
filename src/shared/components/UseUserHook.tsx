import { useState, useEffect, useRef } from "react";
import { UserData } from "../constants/constants";

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
    const API_KEY =
      "e8ce358cf4d831935f6138e4b777c8c73c5b6f6051ab2aa5ced6b8d66a564f1e";
    // Establish WebSocket connection
    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/auth/me?api_key=${API_KEY}`
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

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []); // Empty dependency array to run only once

  return {
    userData, // Return the user data
    isConnected: socketRef.current?.readyState === WebSocket.OPEN, 
  };
};

export default useUserDataHook;
