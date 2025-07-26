"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./sd-mobile-nav";
import Link from "next/link";
import { useNotification } from "@/context/socket-context";
import { useState, useRef, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export function Navbar() {
  const { unreadCount, clearNotifications, isConnected, notifications } =
    useNotification();
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const setIsChatOpen = useChatStore((state) => state.setIsChatOpen);

  console.log("🔔 Navbar - unreadCount:", unreadCount);
  console.log("🔌 Navbar - isConnected:", isConnected);
  console.log("📋 Navbar - notifications:", notifications);

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setShowNotificationMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = () => {
    console.log("🔔 Notification button clicked");
    setShowNotificationMenu(!showNotificationMenu);
  };

  const handleChatClick = () => {
    console.log("🔔 Opening chat and clearing notifications");
    setIsChatOpen(true);
    clearNotifications(); // Clear notifications when chat is opened
    setShowNotificationMenu(false); // Also close the notification menu
  };

  const handleClearNotifications = () => {
    console.log("🗑️ Clearing notifications from navbar...");
    clearNotifications();
    setShowNotificationMenu(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <nav className="h-16 flex items-center px-2 sm:px-6 justify-between bg-white relative">
      <div className="flex items-center gap-4">
        <MobileNav />
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/DashboardPage/wwahframe.svg"
              alt="Worldwide Admissions Hub Logo - desktop"
              width={250}
              height={32}
              priority
              className="hidden md:block"
            />
          </Link>
          <Link href="/">
            <Image
              src="/DashboardPage/wwah.svg"
              alt="Worldwide Admissions Hub Logo - mobile"
              width={150}
              height={32}
              priority
              className="block md:hidden h-[80px] w-[80px]"
            />
          </Link>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link href="/dashboard/favouritecourses">
          <Button
            className="flex items-center bg-[#F4D0D2] text-[#C7161E] border border-[#C7161E] rounded-lg hover:bg-red-50"
            aria-label="Favourites"
          >
            <Image
              src="/DashboardPage/usericon.svg"
              alt="User Icon"
              width={20}
              height={20}
              className="w-[24px] sm:w-[20px] h-[28px] sm:h-[20px]"
            />
            <span className="hidden lg:inline">Favourites</span>
          </Button>
        </Link>
        <div className="relative" ref={notificationMenuRef}>
          <Button
            onClick={handleNotificationClick}
            className="relative flex items-center bg-[#F1F1F1] text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            aria-label="Notifications"
          >
            <Image
              src="/DashboardPage/bell.svg"
              alt="Notification Bell Icon"
              width={20}
              height={20}
              className="w-[24px] sm:w-[20px] h-[28px] sm:h-[20px]"
            />
            <span className="hidden lg:inline">Notifications</span>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 lg:relative lg:top-0 lg:right-0 ml-2 px-2 py-0.5 text-xs bg-[#C7161E] text-white rounded-full">
                {unreadCount}
              </span>
            )}

            {!isConnected && (
              <span
                className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
                title="Connection lost"
              />
            )}
          </Button>

          {/* Notification Menu */}
          {showNotificationMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleClearNotifications}
                      className="text-sm text-[#C7161E] hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotificationMenu(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <MessageCircle
                      size={48}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        onClick={handleChatClick}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-[#C7161E] rounded-full flex items-center justify-center">
                              <MessageCircle size={20} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-800">
                                Message from{" "}
                                {notification.username ||
                                  notification.sender ||
                                  "Admin"}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.text ||
                                notification.message ||
                                "New message received"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <p className="text-xs text-gray-500 text-center">
                    {notifications.length} notification
                    {notifications.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
