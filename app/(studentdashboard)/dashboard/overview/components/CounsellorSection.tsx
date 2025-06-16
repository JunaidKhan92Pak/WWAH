import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ChatModal from "./ChatBox";
import Link from "next/link";

const CounsellorSection = ({ userEmail }: { userEmail: { email: string } }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const closeChat = () => setIsChatOpen(false);

  return (
    <>
      <div className="justify-center items-center flex flex-col text-center pt-8">
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
          universities, Fatima speci- alizes in personalized support, from
          application processes to visa assistance.
        </p>

        <Button
          onClick={() => setIsChatOpen(true)}
          className="text-white px-11 bg-[#C7161E] hover:bg-[#C7161E] "
        >
          <Image
            src="/DashboardPage/chat.svg"
            alt="chat"
            width={18}
            height={18}
          />
          Chat with Fatima
        </Button>
        {isChatOpen && <ChatModal userEmail={userEmail} onClose={closeChat} />}
        <p className="my-4">OR</p>

        <Link href="/schedulesession">
          {" "}
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
    </>
  );
};

export default CounsellorSection;
