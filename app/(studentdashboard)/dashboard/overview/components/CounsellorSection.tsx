import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import ChatModal from "./ChatBox";
import Link from "next/link";
import { useChatStore } from "@/store/chatStore";
import { useSocket } from "@/context/socket-context"; // Import socket context

const CounsellorSection = ({ userEmail }: { userEmail: { email: string } }) => {
  const {  setIsChatOpen } = useChatStore();
  const { socket,  clearNotifications } = useSocket(); // Use socket context

  // console.log("Current isChatOpen:", isChatOpen);
  // console.log("setIsChatOpen function:", setIsChatOpen);

  // ✅ Ensure user joins notification room when component mounts
  useEffect(() => {
    if (socket && userEmail?.email && socket.connected) {
      // console.log("🔔 Joining notification room for:", userEmail.email);

      // Join the notification room immediately
      socket.emit("join_notification_room", { userId: userEmail.email });

      // Also join regular room for good measure
      socket.emit("join", userEmail.email);

      // console.log("✅ Notification room join events emitted");
    }
  }, [socket, userEmail?.email, socket?.connected]);

  // const closeChat = () => {
  //   setIsChatOpen(false);
  //   // Clear notifications when chat closes
  //   clearNotifications();
  // };

  const handleChatClick = () => {
    // console.log("Button clicked - before:", isChatOpen);
    setIsChatOpen(true);
    // Clear notifications when opening chat
    clearNotifications();
    // console.log("Button clicked - after calling set");
  };

  return (
    <>
      <div className="relative w-full">
        {/* Blurred counsellor section */}
        <div className="justify-center items-center flex flex-col text-center pt-8 blur-sm opacity-30 pointer-events-none">
          <p className="font-semibold text-lg md:text-xl">
            Your Designated Counsellor
          </p>
          <div className="my-6">
            <Image
              src="/DashboardPage/Objects.svg"
              alt="Object"
              width={64}
              height={64}
              className="rounded-full mx-auto"
            />
          </div>
          <p className="font-semibold text-lg md:text-xl">FATIMA KHAN</p>
          <p className="text-[#313131] text-base">fatimakhan@gmail.com</p>
          <p className="px-6 py-2 bg-[#FCE7D2] text-[#C7161E] my-4 rounded-xl">
            Study Abroad Advisor
          </p>
          <p className="mb-12 text-lg leading-snug">
            With extensive experience in guiding students toward their dream
            universities, Fatima specializes in personalized support, from
            application processes to visa assistance.
          </p>

          <div className="relative">
            <Button
              onClick={handleChatClick}
              className="text-white px-11 bg-[#C7161E] hover:bg-[#C7161E]"
            >
              <Image
                src="/DashboardPage/chat.svg"
                alt="chat"
                width={18}
                height={18}
              />
              Chat with Fatima
            </Button>
          </div>

          <p className="my-4">OR</p>

          <Link href="/schedulesession">
            <Button className="text-white bg-[#C7161E] hover:bg-[#C7161E]">
              <Image
                src="/DashboardPage/counsellingsession.svg"
                alt="chat"
                width={13}
                height={13}
              />
              Book a Counselling Session
            </Button>
          </Link>
        </div>

        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <p className="text-black font-medium text-base md:text-lg md:leading-snug mb-4">
            You will be assigned a WWAH advisor soon.
          </p>

          <button className="bg-[#C7161E] text-white px-6 py-2 text-[14px] rounded-full">
            <Link href="/dashboard/completeapplication">
              Complete Your Profile
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default CounsellorSection;
