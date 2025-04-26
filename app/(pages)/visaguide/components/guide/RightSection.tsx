import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
interface DataType {
  accept_offer: string;
  online_interview: string;
  visa_application_process: { title: string; description: string[] }[];
  submit_application: string;
  await_decision: string;
  Receive_your_visa: string;
  accommodation: string;
  prepare_for_arrival: string;
  collect_your_biometric_residence_permit: string;
  university_enrollment: string;
}

export const RightSection = ({ data }: { data: DataType }) => {
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <div id="right-section" className=" py-4 px-4 ">
      {/* Choose your Program */}
      <div id="1" ref={targetRef}>
        <div className="flex items-center gap-4 p-3 ">
          <Image
            src={"/visaguide/choose.svg"}
            alt={"choose progarm"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Choose your Program</p>
        </div>
        <p>
          Choose the program and University you are interested in.{" "}
          <Link
            href="#"
            className="text-[#F0851D] underline font-bold"
          >
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
            src={"/visaguide/register.svg"}
            alt={"register"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Register& Apply:</p>
        </div>
        <p>
          Click on{" "}
          <Link
            target="blank"
            href="#"
            className="text-[#C7161E] underline font-bold"
          >
            Apply Now{" "}
          </Link>
          after creating your personalized profile through registered account.
          You can monitor your applications and receive regular updates.{" "}
          <Link
            target="blank"
            href="#"
            className="text-[#F0851D] underline font-bold"
          >
            Register here.
          </Link>
        </p>
      </div>
      <hr />
      {/* Pay the Application Fee */}
      <div id="3" className="pb-4" ref={targetRef}>
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src="/visaguide/fee.svg"
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
            src="/visaguide/track.svg"
            alt={"track"}
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
            src={"/visaguide/offer.svg"}
            alt={"offer"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Accept your Offer:</p>
        </div>
        <div className="space-y-2">
          <p>{data.accept_offer}</p>
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
            src={"/visaguide/interview.svg"}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Online Interview:</p>
        </div>

        <p>{data.online_interview}</p>
      </div>
      <hr />
      {/* Visa Application Process */}
      <div id="7" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={"/visaguide/process.svg"}
            alt={"process"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Visa Application Process:</p>
        </div>
        {data.visa_application_process?.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-center py-4 ">
              <ul className="w-[90%] space-y-3">
                <li>
                  <div className="flex gap-3 items-start">
                    <Image
                      src={"/visaguide/bullet.svg"}
                      alt={"fee"}
                      width={15}
                      height={15}
                      className="object-contain"
                    />
                    <p>{item.title}</p>
                  </div>
                  {item.description?.map((description, index) => (
                    <div key={index} className="flex justify-end ">
                      {" "}
                      <ul className="w-[90%] space-y-3 ">
                        <li>
                          <p>{description}</p>
                        </li>
                      </ul>
                    </div>
                  ))}
                </li>
              </ul>
            </div>
          </div>
        ))}

        <div className="  flex justify-end">
          <p className="md:w-[55%] p-6  rounded-2xl bg-[#FCE7D2]">
            {" "}
            Prepare the necessary documents mentioned in the required documents
            section of your desired course page.
          </p>
        </div>
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-end my-4 gap-2">
          <div>
            <p className="font-semibold ">
              If you need any help with your embassy process, Contact with{" "}
              <Link
                target="blank"
                href="#"
                className="text-[#F0851D]  underline font-bold"
              >
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
            src={"/visaguide/submit.svg"}
            alt={"submit"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Submit your Application:</p>
        </div>
        <p>{data.submit_application}</p>
      </div>
      <hr />
      {/* Await a Decision */}
      <div id="9" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={"/visaguide/decision.svg"}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Await a Decision:</p>
        </div>

        <p>{data.await_decision}</p>
      </div>
      <hr />
      {/* Receive Your Visa */}
      <div id="10" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={"/visaguide/recieve.svg"}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Receive Your Visa:</p>
        </div>
        {data.Receive_your_visa}
      </div>
      <hr />
      {/* Accommodation */}
      <div id="11" className="pb-4">
        <div className="flex items-center gap-4 p-3  ">
          <Image
            src={"/visaguide/accommodation.svg"}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Accommodation:</p>
        </div>
        <p>{data.accommodation}</p>
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
            src={"/visaguide/accommodation.svg"}
            alt={"fee"}
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-bold">Prepare for Arrival:</p>
        </div>
        <p>{data.prepare_for_arrival}</p>
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-center my-4 gap-2">
          <div className="">
            <p className="font-semibold ">
              <Link
                target="blank"
                href="#"
                className="text-[#C7161E] underline font-bold"
              >
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
            src={"/visaguide/accommodation.svg"}
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
          <p>{data.collect_your_biometric_residence_permit}</p>
          <p className="font-semibold">University Enrollment:</p>
          <p>{data.university_enrollment}</p>
        </div>
      </div>
    </div>
  );
};
