import React from 'react'
import Image from "next/image";
import { Button } from "@/components/ui/button";

const CounsellorSection = () => {
  return (
    <>
      <div className='justify-center items-center flex flex-col text-center pt-8'>
        <p className='font-semibold'>Your Designated Counsellor</p>
        <div className='my-6'>
          <Image
            src="/DashboardPage/Objects.svg"
            alt="Object"
            width={64}
            height={64}
            className="rounded-full mx-auto"
          />
        </div>
        <p className='font-semibold'>FATIMA KHAN</p>
        <p className='text-base text-[#313131]'>fatimakhan@gmail.com</p>
        <p className='px-4 py-2 text-base bg-[#FCE7D2] text-[#C7161E] my-3'>Study Abroad Advisor</p>
        <p className='text-base text-center mb-6'>With extensive experience in  guiding students
          toward their  dream universities, Fatima speci-
          alizes in personalized support, from application
          processes to visa assistance.</p>

        <Button className='text-white px-11 bg-[#C7161E] '>
          <Image
            src="/DashboardPage/chat.svg"
            alt="chat"
            width={18}
            height={18}
          />
          Chat with Fatima</Button>

        <p className='my-2'>OR</p>

        <Button className='text-white bg-[#C7161E]'>
          <Image
            src="/DashboardPage/counsellingsession.svg"
            alt="chat"
            width={13}
            height={13}
          />Book a Counselling Session</Button>


      </div>
    </>
  )
}

export default CounsellorSection
