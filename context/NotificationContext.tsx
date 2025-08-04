"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_API!, {
  autoConnect: false,
});

const NotificationContext = createContext<{
  socket: typeof socket;
  notifications: any[];
  unreadCount: number;
  clearNotifications: () => void;
  isConnected: boolean;
}>({
  socket,
  notifications: [],
  unreadCount: 0,
  clearNotifications: () => {},
  isConnected: false,
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    console.log("🚀 NotificationProvider: Connecting socket...");

    // Get user email from localStorage
    const email =
      typeof window !== "undefined" ? localStorage.getItem("email") : "admin";
    setCurrentUserEmail(email || "admin");

    socket.connect();

    // Handle connection
    socket.on("connect", () => {
      // console.log("✅ Socket connected successfully");
      setIsConnected(true);

      // console.log("👤 User email for notifications:", email || "admin");

      // Join room with user email
      socket.emit("join", email || "admin");
      // console.log("🏠 Emitted join event with email:", email || "admin");
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // Handle successful room join
    socket.on("joined", (data) => {
      // console.log("🎉 Successfully joined room:", data);
    });

    // ✅ Handle notifications - only for messages received from others
    socket.on("new_notification", (data) => {
      console.log("🔔 Notification received:", data);
      console.log("👤 Current user:", email || "admin");
      console.log("📤 Notification recipient:", data.recipientEmail);

      // Only process notification if it's meant for this user
      if (data.recipientEmail === (email || "admin")) {
        // console.log("✅ Processing notification for current user");

        setNotifications((prev) => {
          const newNotifications = [...prev, data];
          // console.log("📋 Updated notifications:", newNotifications);
          return newNotifications;
        });

        // Show toast notification
        toast(data.message, {
          icon: "🔔",
          style: {
            background: "#C7161E",
            color: "#fff",
            fontSize: "14px",
          },
        });
      } else {
        console.log("🚫 Ignoring notification not meant for this user");
      }
    });

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up socket connection...");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("joined");
      socket.off("new_notification");
      socket.disconnect();
    };
  }, []);

  const clearNotifications = () => {
    console.log("🗑️ Clearing notifications...");
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        socket,
        notifications,
        unreadCount: notifications.length,
        clearNotifications,
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
