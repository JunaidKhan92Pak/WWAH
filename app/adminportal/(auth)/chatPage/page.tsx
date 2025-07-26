"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Download, FileText, Image as ImageIcon, File } from "lucide-react";

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_API}`, {
  autoConnect: false,
});

type Message = {
  text: string;
  sender: "user" | "admin";
  timestamp: string;
  userEmail?: string;
  file?: {
    name: string;
    url: string;
    type: string;
    size: number;
    s3Key?: string;
    downloadUrl?: string; // Pre-signed URL for downloading
  };
};

export default function AdminChatPanel() {
  const [users, setUsers] = useState<string[]>([]); // list of emails
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();
    socket.emit("join", "admin");

    socket.on("connect", () => {
      console.log("Admin socket connected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 1️⃣ Load user list
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}admin/chats`)
      .then((res) => res.json())
      .then((chats: { userEmail: string }[]) => {
        setUsers(chats.map((c) => c.userEmail));
      });
  }, []);

  // 2️⃣ When admin selects a user
  useEffect(() => {
    if (!selectedUser) return;

    // Load chat history
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}chat/messages/${selectedUser}`)
      .then((res) => res.json())
      .then((data: Message[]) => {
        setMessages(data);
        setTimeout(
          () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
          50
        );
      });

    // Listen for new messages
    const handleMessage = (msg: Message) => {
      console.log("Admin received message:", msg);
      // Only add if it's for the currently selected user
      if (msg.userEmail === selectedUser || !msg.userEmail) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(
          () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
          50
        );
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [selectedUser]);

  const sendReply = () => {
    if (!input.trim()) return;

    // Add message to UI immediately
    const newMessage: Message = {
      text: input,
      sender: "admin",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Send via socket
    socket.emit("send_message", {
      email: selectedUser,
      text: input,
      sender: "admin",
    });

    setInput("");
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper function to get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon size={16} className="text-blue-500" />;
    } else if (fileType.includes("pdf")) {
      return <FileText size={16} className="text-red-500" />;
    } else {
      return <File size={16} className="text-gray-500" />;
    }
  };

  // Function to download file
  const downloadFile = async (file: Message["file"]) => {
    if (!file) return;

    try {
      let downloadUrl = file.downloadUrl || file.url;

      // If we have an S3 key but no download URL, get a fresh pre-signed URL
      if (file.s3Key && !file.downloadUrl) {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_API
          }chat/download/${encodeURIComponent(file.s3Key)}`
        );

        if (response.ok) {
          const data = await response.json();
          downloadUrl = data.downloadUrl;
        }
      }

      // Create download link
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Heading */}
      <header className="bg-red-600 p-4">
        <h1 className="text-2xl font-bold text-orange-100 text-center">
          WWAH Admin
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Users */}
        <aside className="w-1/4 bg-orange-50 p-4 space-y-2 border-r border-red-200 overflow-y-auto">
          <h2 className="text-lg font-semibold text-red-700 mb-4">Students</h2>
          {users.map((email) => (
            <button
              key={email}
              onClick={() => setSelectedUser(email)}
              className={`block w-full text-left px-4 py-2 rounded-lg hover:bg-orange-100 transition ${
                selectedUser === email
                  ? "bg-red-200 text-red-900"
                  : "text-red-700"
              }`}
            >
              {email}
            </button>
          ))}
        </aside>

        {/* Main Chat Area */}
        <section className="flex-1 flex flex-col bg-orange-50">
          {/* Chat history */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {selectedUser ? (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === "admin" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl inline-block max-w-[70%] break-words ${
                      msg.sender === "admin"
                        ? "bg-red-100 text-red-900"
                        : "bg-orange-200 text-orange-900"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>

                    {/* File attachment display */}
                    {msg.file && (
                      <div className="mt-2 p-2 bg-white/50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          {getFileIcon(msg.file.type)}
                          <span className="text-xs font-medium truncate flex-1">
                            {msg.file.name}
                          </span>
                          <button
                            onClick={() => downloadFile(msg.file)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-white/80 transition"
                            title="Download file"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(msg.file.size)}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-red-600 mt-1">
                    {msg.sender === "admin" ? "Admin" : "User"},{" "}
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-red-600 mt-10">
                Select a user to chat
              </p>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Message input */}
          {selectedUser && (
            <div className="p-4 border-t border-red-200 flex items-center gap-2 bg-orange-50">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                className="flex-1 border border-red-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Type your reply..."
              />
              <button
                onClick={sendReply}
                className="bg-red-600 text-orange-100 px-4 py-2 rounded-full hover:bg-red-700 transition"
              >
                Send
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
