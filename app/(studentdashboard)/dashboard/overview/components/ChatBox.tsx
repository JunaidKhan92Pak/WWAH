"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  X,
  Smile,
  Paperclip,
  Download,
  FileText,
  Image as ImageIcon,
  File,
} from "lucide-react";
import dynamic from "next/dynamic";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_API}`, {
  autoConnect: false,
});

type Message = {
  text: string;
  sender: "user" | "admin";
  timestamp: string;
  file?: {
    name: string;
    url: string;
    type: string;
    size: number;
    s3Key?: string;
    downloadUrl?: string; // Pre-signed URL for downloading
  };
};

interface ChatModalProps {
  userEmail: {
    email: string;
  };
  onClose: () => void;
}
interface FileUploadResult {
  name: string;
  url: string;
  type: string;
  size: number;
  s3Key: string;
}
interface EmojiData {
  emoji: string;
  unified: string;
  names: string[];
  // Add other properties if your emoji picker provides them
}
export default function ChatModal({ userEmail, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userEmail) return;
    console.log(userEmail, "User email for chat");
    const mail = userEmail.email;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}chat/messages/${mail}`)
      .then((res) => res.json())
      .then((data: Message[]) => {
        setMessages(data);
        setTimeout(
          () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
          50
        );
      });

    socket.connect();
    socket.emit("join", userEmail);
    socket.on("receive_message", (msg: Message) => {
      console.log("Received message");
      setMessages((prev) => [...prev, msg]);
      setTimeout(
        () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
      setMessages([]);
    };
  }, [userEmail]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File): Promise<FileUploadResult> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", userEmail.email);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}chat/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return {
        name: data.fileName,
        url: data.fileUrl,
        type: data.fileType,
        size: data.fileSize,
        s3Key: data.s3Key,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return;

    try {
      let fileData = null;

      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      console.log("Sending message:", input);
      socket.emit("send_message", {
        email: userEmail,
        text:
          input || (selectedFile ? `Sent a file: ${selectedFile.name}` : ""),
        sender: "user",
        file: fileData,
      });

      setInput("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const onEmojiClick = (emojiData: EmojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon size={16} className="text-blue-500" />;
    } else if (fileType.includes("pdf")) {
      return <FileText size={16} className="text-red-500" />;
    } else {
      return <File size={16} className="text-gray-500" />;
    }
  };

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
    <div className="fixed bottom-0 right-0 h-[500px] w-full max-w-md p-4 z-50">
      <div className="relative bg-white rounded-2xl shadow-xl h-full flex flex-col overflow-hidden">
        {/* Close Icons */}
        <button
          onClick={onClose}
          className="absolute top-5 right-4 text-white z-20"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-red-600 p-4">
          <h2 className="text-xl font-bold text-orange-100 text-center">
            WWAH Live Chat
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-orange-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl inline-block max-w-[80%] break-words ${
                  msg.sender === "user"
                    ? "bg-orange-200 text-orange-900"
                    : "bg-red-100 text-red-900"
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
                        className="text-blue-600 hover:text-blue-800"
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
                {msg.sender === "user" ? "You" : "Admin"},{" "}
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* File preview (when file is selected) */}
        {selectedFile && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
              {getFileIcon(selectedFile.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Upload progress */}
        {isUploading && (
          <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="text-xs text-blue-600 mb-1">
                  Uploading file...
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-red-200 flex items-center gap-2 bg-white relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-red-500 hover:text-red-700 p-1"
            title="Attach file"
            disabled={isUploading}
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isUploading && sendMessage()
            }
            className="flex-1 border border-red-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            placeholder="Type your message..."
            disabled={isUploading}
          />

          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-red-500 hover:text-red-700"
            disabled={isUploading}
          >
            <Smile size={20} />
          </button>

          <button
            onClick={sendMessage}
            className="bg-red-600 text-orange-100 rounded-full px-4 py-2 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            {isUploading ? "..." : "Send"}
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 right-4 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
