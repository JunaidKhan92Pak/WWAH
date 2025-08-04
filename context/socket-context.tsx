"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { useChatStore } from "@/store/chatStore";

// ✅ Single socket instance
const socket = io(process.env.NEXT_PUBLIC_BACKEND_API!, {
  autoConnect: false,
});

console.log(
  "🔌 Socket initialized with URL:",
  process.env.NEXT_PUBLIC_BACKEND_API
);

import type { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket;
  notifications: Notification[];
  unreadCount: number;
  clearNotifications: () => void;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

import { ReactNode } from "react";

type Notification = {
  sender?: string;
  username?: string;
  message?: string;
  text?: string;
  [key: string]: any;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("🚀 SocketProvider: Connecting socket...");

    // Connect socket
    socket.connect();

    socket.on("connect", () => {
      // console.log("✅ Socket connected successfully");
      setIsConnected(true);

      // Get user email from localStorage after connection
      const email =
        typeof window !== "undefined" ? localStorage.getItem("email") : "admin";
      // console.log("👤 User email from localStorage:", email);

      if (email && email !== "admin") {
        // ✅ IMMEDIATELY join both rooms when socket connects
        // console.log("🏠 Joining regular room:", email);
        socket.emit("join", email);

        // console.log("🔔 Joining notification room:", email);
        socket.emit("join_notification_room", { userId: email });

        // console.log("✅ Both room join events emitted for:", email);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // ✅ Confirmation that room was joined
    socket.on("joined", (data) => {
      // console.log("🎉 Successfully joined room:", data);
    });

    // ✅ Handle received messages - ONLY show notifications for admin messages
    socket.on("receive_message", (data) => {
      // console.log("📨 Message received:", data);

      // ✅ Only show notification if message is from admin
      if (data.sender === "admin") {
        // console.log("🔔 Admin message - showing notification");

        // Add to notifications
        setNotifications((prev) => {
          const newNotifications = [...prev, data];
          // console.log("📋 Updated notifications:", newNotifications);
          return newNotifications;
        });

        // Show clickable toast notification
        const displayName = data.username || data.sender || "Admin";
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-[#C7161E] text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 cursor-pointer hover:bg-[#a01419] transition-colors`}
            onClick={() => {
              // console.log("🖱️ Toast clicked - opening chat");
              useChatStore.getState().setIsChatOpen(true);
              toast.dismiss(t.id);
            }}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-lg">💬</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">
                    Message from {displayName}
                  </p>
                  <p className="text-xs text-white opacity-90 mt-1">
                    Click to open chat
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-transparent rounded-md inline-flex text-white hover:text-gray-200 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.dismiss(t.id);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ));
      } else {
        // console.log("👤 User message - no notification needed");
      }
    });

    // ✅ Handle notification room messages separately
    socket.on("new_notification", (data) => {
      // console.log("🔔 General notification received:", data);

      setNotifications((prev) => {
        const newNotifications = [...prev, data];
        // console.log("📋 Updated notifications:", newNotifications);
        return newNotifications;
      });

      // Get the display name for the notification
      const displayName =
        data.sender === "admin"
          ? "Admin"
          : data.username || data.sender || "Admin";

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } w-full max-w-sm bg-white border border-gray-200 text-gray-900 shadow-md rounded-md pointer-events-auto flex transition-all cursor-pointer hover:bg-gray-50`}
          onClick={() => {
            // console.log("🖱️ Notification toast clicked - opening chat");
            useChatStore.getState().setIsChatOpen(true);
            toast.dismiss(t.id);
          }}
        >
          <div className="flex-1 p-1 flex items-start">
            <div className="text-base leading-none mr-2">💬</div>
            <div className="flex-1">
              <p className="text-sm font-medium">Message from {displayName}</p>
              <p className="text-xs text-gray-600 mt-0.5">Click to open chat</p>
            </div>
          </div>
          <div className="px-2 flex items-start pt-3">
            <button
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ));
    });

    // ✅ Handle notification room join confirmation
    socket.on("notification_room_joined", (data) => {
      // console.log("🔔 Successfully joined notification room:", data);
    });

    // ✅ Cleanup function
    return () => {
      // console.log("🧹 Cleaning up socket connection...");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("joined");
      socket.off("receive_message");
      socket.off("new_notification");
      socket.off("notification_room_joined");
      socket.disconnect();
    };
  }, []);

  const clearNotifications = () => {
    // console.log("🗑️ Clearing notifications...");
    setNotifications([]);
  };

  const value = {
    socket,
    notifications,
    unreadCount: notifications.length,
    clearNotifications,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

// ✅ Custom hook for accessing socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// ✅ Custom hook for notifications (backward compatibility)
export const useNotification = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useNotification must be used within a SocketProvider");
  }
  return context;
};

export default SocketProvider;
