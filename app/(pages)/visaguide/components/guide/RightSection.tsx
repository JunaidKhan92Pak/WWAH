import React from "react";
import choose from "../../../../../public/visaguide/choose.png";
import accommodation from "../../../../../public/visaguide/accommodation.png";
import desicion from "../../../../../public/visaguide/decision.png";
import fee from "../../../../../public/visaguide/fee.png";
import interview from "../../../../../public/visaguide/interview.png";
import offer from "../../../../../public/visaguide/offer.png";
import process from "../../../../../public/visaguide/process.png";
import recieve from "../../../../../public/visaguide/recieve.png";
import register from "../../../../../public/visaguide/register.png";
import submit from "../../../../../public/visaguide/submit.png";
import track from "../../../../../public/visaguide/track.png";
import bullet from "../../../../../public/visaguide/bullet.svg";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
export const RightSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  return (
    <div className=" py-4 px-4 ">
      {/* Choose your Program */}

      <div id="1" ref={targetRef}>
        <div className="flex items-center gap-4 p-3 ">
          <Image
            src={choose}
            alt={"choose progarm"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Choose your Program</p>
        </div>
        <p>
          Choose the program and University you are interested in.{" "}
          <Link href="#" className="text-[#F0851D] underline font-bold">
            Find out
          </Link>{" "}
          the Programs of your choice.
        </p>
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-end my-4 gap-2">
          <div className="md:w-1/2">
            <p className="font-semibold ">
              Not sure which Program or University is right for you?
            </p>
          </div>
          <div className="md:w-1/2 flex md:justify-end justify-center items-center">
            <button className="bg-[#C7161E] text-xs md:text-sm 2xl:text-xl text-white rounded-lg p-3 ">
              Get personalized guidance from ZEUS
            </button>
          </div>
        </div>
      </div>
      <hr />
      {/* Register& Apply */}
      <div id="2" className="pb-4" ref={targetRef}>
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={register}
            alt={"register"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Register& Apply:</p>
        </div>
        <p>
          Click on{" "}
          <Link href="#" className="text-[#C7161E] underline font-bold">
            Apply Now{" "}
          </Link>
          after creating your personalized profile through registered account.
          You can monitor your applications and receive regular updates.{" "}
          <Link href="#" className="text-[#F0851D] underline font-bold">
            Register here.
          </Link>
        </p>
      </div>
      <hr />
      {/* Pay the Application Fee */}
      <div id="3" className="pb-4" ref={targetRef}>
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={fee}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Pay the Application Fee:</p>
        </div>
        <p>
          Make sure to pay the application fee (if required) to finalize your
          submission. Payment can be made easily directly to the university
          through bank, money exchangers, online apps and WWAH secure online
          payment system
        </p>
      </div>
      <hr />
      {/* Track your Application */}
      <div id="4" className="pb-4" ref={targetRef}>
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={track}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Track your Application:</p>
        </div>
        <p>
          Once your application is submitted, you can monitor its progress
          through your personalized WWAH dashboard. Stay informed with real-time
          updates and notifications.
        </p>
      </div>
      <hr />
      {/* Accept your Offer */}
      <div id="5" className="pb-4" ref={targetRef}>
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={offer}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Accept your Offer:</p>
        </div>
        <div className="space-y-2">
          <p>
            You will receive offers directly from the universities, which can be
            conditional (subject to achieving certain grades/Initial Deposit) or
            unconditional.
          </p>
          <p>
            If you are accepted with an unconditional offer, then
            congratulations! You have a place and you can accept straightaway
            You will receive a Confirmation of Acceptance for Studies (CAS)
            Letter which is a pre-requisite electronic document that is issued
            by your educational Institution to support your student visa
            application for the UK.
          </p>{" "}
          <p>
            {" "}
            If you are accepted with a conditional offer, the place is yours as
            long as you meet a few extra requirements. This could be achieving
            certain exam grades or English language test scores or Initial
            Deposit.
          </p>
        </div>
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-end my-4 gap-2">
          <div className="md:w-1/2">
            <p className="font-semibold ">
              If you are worried about missing your offer letter because of your
              English language proficiency.
            </p>
          </div>
          <div className="md:w-1/2 flex md:justify-end justify-center items-center">
            <button className="bg-[#C7161E] text-xs md:text-sm 2xl:text-xl text-white rounded-lg p-3 ">
              Contact & Book IELTS/PTE classes with us.
            </button>
          </div>
        </div>
      </div>
      <hr />
      {/* Online Interview */}
      <div id="6" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={interview}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Online Interview:</p>
        </div>
        <p>
          Some universities in the United Kingdom require international students
          to participate in an online interview as part of the application
          process before issuing an offer letter. The Purpose of the Online
          Interview is to assess English Proficiency, to verify your Application
          Details, and to understand your reasons for choosing the particular
          course and university
        </p>
      </div>
      <hr />
      {/* Visa Application Process */}
      <div id="7" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={process}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Visa Application Process:</p>
        </div>
        <p>
          Some universities in the United Kingdom require international students
          to participate in an online interview as part of the application
          process before issuing an offer letter. The Purpose of the Online
          Interview is to assess English Proficiency, to verify your Application
          Details, and to understand your reasons for choosing the particular
          course and university
        </p>
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-end my-4 gap-2">
          <div className="">
            <p className="font-semibold ">
              Prepare the necessary documents mentioned in the{" "}
              <Link href="#" className="text-[#C7161E] underline font-bold">
                required documents
              </Link>{" "}
              section of your desired course page.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-4 ">
          <ul className="w-[90%] space-y-3">
            <li>
              <div className="flex gap-3 items-start">
                <Image
                  src={bullet}
                  alt={"fee"}
                  width={15}
                  height={15}
                  className="object-contain"
                />
                <p>Documents for visa Application are:</p>
              </div>
              <div className="flex justify-end ">
                {" "}
                <ul className="w-[90%] space-y-3 ">
                  <li>
                    <p>Current passport or other valid travel documentation</p>
                  </li>
                  <li>
                    <p>
                      Confirmation of Acceptance for Studies (CAS) from your
                      chosen university{" "}
                    </p>
                  </li>
                  <li>
                    <p>Tuberculosis test results </p>
                  </li>
                  <li>
                    <p>
                      Financial Documents o Family Registration Certificate
                      (FRC)
                    </p>
                  </li>
                  <li>
                    <p>Affidavit of Support</p>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div className="flex gap-2 items-start">
                <Image
                  src={bullet}
                  alt={"fee"}
                  width={15}
                  height={15}
                  className="object-contain"
                />
                <p>
                  Complete the visa application form online at the UK
                  government&apos;s official website.{" "}
                </p>
              </div>
            </li>
            <li>
              <div className="flex gap-2  items-start">
                <Image
                  src={bullet}
                  alt={"fee"}
                  width={15}
                  height={15}
                  className="object-contain"
                />
                <p>
                  Schedule an appointment at a visa application center to have
                  your fingerprints and photograph (biometric information)
                  taken. This is a mandatory part of the application process.
                </p>
              </div>
            </li>

            <li>
              <div className="flex gap-2  items-start">
                <Image
                  src={bullet}
                  alt={"fee"}
                  width={15}
                  height={15}
                  className="object-contain py-1"
                />
                <p>
                  You&apos;ll also have to pay the healthcare surcharge as part
                  of your application, which allows you to use the UK&apos;s
                  National Health Service (NHS). How much you pay depends on how
                  long your visa lasts. Check how much you&apos;ll have to pay
                  before you apply.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="  flex justify-end">
          <p className="md:w-1/2 p-6  rounded-2xl bg-[#FCE7D2]">
            Pay the visa application fee{" "}
            <Link href="#" className="text-[#C7161E] underline font-bold">
              £490
            </Link>{" "}
            if applying from outside the UK.
          </p>
        </div>
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-end my-4 gap-2">
          <div>
            <p className="font-semibold ">
              If you need any help with your embassy process, Contact with{" "}
              <Link href="#" className="text-[#F0851D]  underline font-bold">
                WWAH advisor
              </Link>{" "}
              and get a quick reply!
            </p>
          </div>
        </div>
      </div>
      <hr />
      {/* Submit your Application */}
      <div id="8" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={submit}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Submit your Application:</p>
        </div>
        <p>
          After attending the biometrics appointment, submit your completed
          application and all supporting documents.
        </p>
      </div>
      <hr />
      {/* Await a Decision */}
      <div id="9" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={desicion}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Await a Decision:</p>
        </div>
        <p>
          The processing time for the visa application is usually around three
          weeks if applying from outside the UK, but it can vary. You can check
          the status of your application online.
        </p>
      </div>
      <hr />
      {/* Receive Your Visa */}
      <div id="10" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={recieve}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Receive Your Visa:</p>
        </div>
        <p>
          If your application is approved, you will receive a vignette (sticker)
          in your passport, allowing you to travel to the UK. This vignette is
          usually valid for 30 days, during which you must enter the UK.
        </p>
      </div>
      <hr />
      {/* Accommodation */}
      <div id="11" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={accommodation}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Accommodation:</p>
        </div>
        <p>
          Some international students arrange accommodation before arriving in
          the UK, while others may need to find suitable housing after arrival.
          Universities often provide support and guidance in finding
          accommodation.
        </p>
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-end my-4 gap-2">
          <div className="md:w-1/2">
            <p className="font-semibold ">
              To find the right Accommodation for you
            </p>
          </div>
          <div className="md:w-1/2 flex md:justify-end justify-center items-center">
            <button className="bg-[#C7161E] text-xs md:text-sm 2xl:text-xl text-white rounded-lg p-3 ">
              Get in touch with WWAH advisor
            </button>
          </div>
        </div>
      </div>
      <hr />
      {/* Prepare for Arrival */}
      <div id="12" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={accommodation}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Prepare for Arrival:</p>
        </div>
        <p>
          Arrange travel, attend pre-departure briefings, and prepare for life
          in the UK.
        </p>
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-center my-4 gap-2">
          <div className="">
            <p className="font-semibold ">
              <Link href="#" className="text-[#C7161E] underline font-bold">
                Reach out to your WWAH Advisor
              </Link>{" "}
              to organize your travel arrangements.
            </p>
          </div>
        </div>
      </div>
      <hr />
      {/* Post Arrival Process */}
      <div id="13" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={accommodation}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Post Arrival Process</p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold">
            Collect Your Biometric Residence Permit (BRP):
          </p>
          <p>
            {" "}
            Once in the UK, collect your BRP from the specified post office or
            your university within 10 days of your arrival. The BRP serves as
            your official visa for the duration of your stay.
          </p>
          <p className="font-semibold">University Enrollment:</p>
          <p>
            {" "}
            After arrival, you need to complete your university enrollment
            process, which may involve attending orientation sessions,
            submitting required documents (such as passports, visas, academic
            transcripts), and paying tuition fees
          </p>
        </div>
      </div>
    </div>
  );
};
