import Link from "next/link";
import React, { useState } from "react";
interface ApplicationProcessProps {
  countryname: string;
  uniname: string;
}

export const ApplicationProcess: React.FC<ApplicationProcessProps> = ({
  countryname,
  uniname,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <section className="w-full flex flex-col items-center">
      <div className="w-[90%] flex flex-col justify-center mb-5 sm:mb-10">
        <h2 className="mb-2">Application Process!</h2>
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-4">
          <div className="space-y-4 xl:space-y-5">
            {/* Step 1 */}
            <div>
              <h5>Create an Account</h5>
              <p className="text-gray-700 mt-1">
                Click on{" "}
                <Link
                  target="blank"
                  href="/dashboard/overview"
                  className="text-[#F0851D] hover:underline font-semibold"
                >
                  Apply Now
                </Link>{" "}
                after creating your personalized profile through a registered
                account. You can monitor your applications and receive regular
                updates.{" "}
                <Link
                  target="blank"
                  href="/signup"
                  className="text-[#F0851D] hover:underline font-semibold"
                >
                  Register here.
                </Link>
              </p>
            </div>
            {/* Step 2 */}
            <div>
              <h5 className="pt-1">Submit Your Application</h5>
              <p className="text-gray-700 mt-1">
                Complete your Personal and Educational details. Upload your
                documents and double-check all information before submission.
              </p>
            </div>
          </div>
          {/* Image with CTA */}
          <div className="relative bg-gray-100 p-4 w-full lg:w-[70%] rounded-2xl shadow-md h-40 md:h-56 flex items-center justify-center my-5 lg:my-0">
            <div
              className="absolute inset-0 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: "url('/application-process-img.png')",
              }}
            ></div>
            <div className="relative text-center text-white">
              <h6 className="mb-2">
                Begin Your Academic Journey in {countryname}
              </h6>
              <Link
                target="blank"
                href="/visaguide"
                className="bg-red-500 text-white px-2 py-3 rounded-md hover:bg-red-600 text-sm"
              >
                Learn About the Application Process
              </Link>
            </div>
          </div>
        </div>
        {/* Step 3 */}
        <div>
          <h5>Pay the Application Fee (If required)</h5>
          <p className="text-gray-700 mt-1">
            Make sure to pay the application fee (if applicable) to finalize
            your submission. Payment can be made easily directly to the
            university through bank, money exchangers, online apps, and WWAH
            secure online payment system.
          </p>
          {!isExpanded ? (
            <button
              onClick={handleToggle}
              className="text-red-500 hover:underline font-semibold text-[16px]"
            >
              Read More
            </button>
          ) : (
            <>
              {/* Step 4 */}
              <div className="space-y-4 md:space-y-5 mt-5">
                <div>
                  <h5>Track Your Application</h5>
                  <p className="text-gray-700 mt-1">
                    Once your application is submitted, you can monitor its
                    progress through your personalized WWAH dashboard. Stay
                    informed with real-time updates and notifications.
                  </p>
                </div>
                {/* Step 5 */}
                <div>
                  <h5>Receive Your Offer Letter</h5>
                  <p className="text-gray-700 mt-1">
                    If your application is successful, you&apos;ll receive an
                    offer letter from the university. Review the offer carefully
                    and accept it through our portal.{" "}
                    <Link
                      target="blank"
                      href="/visaguide"
                      className="text-[#F0851D] hover:underline font-semibold"
                    >
                      Check
                    </Link>{" "}
                    Application process of {uniname} for more details.
                  </p>
                </div>
                {/* Step 6 */}
                <div>
                  <h5>Apply for a Visa</h5>
                  <p className="text-gray-700 mt-1">
                    Once you&apos;ve accepted an offer and received your visa
                    letter, start the visa application process. We&apos;ll
                    provide guidance and resources to help you secure your
                    student visa. For {countryname} Visa Application
                    requirements and process,{" "}
                    <Link
                      target="blank"
                      href="/visaguide"
                      className="text-[#F0851D] hover:underline font-semibold"
                    >
                      Click Here.
                    </Link>
                  </p>
                </div>
                {/* Step 7 */}
                <div>
                  <h5>Plan Your Arrival</h5>
                  <p className="text-gray-700 mt-1">
                    After your visa is approved, begin planning journey. WWAH
                    offers tips on accommodation, travel, and settling into your
                    new environment.
                  </p>
                </div>
                {/* Step 8 */}
                <div>
                  <h5>Begin Your Academic Journey</h5>
                  <p className="text-gray-700 mt-1">
                    Congratulations! You&apos;re all set to start your studies
                    abroad. Stay connected with the WWAH team throughout your
                    academic journey for any assistance.
                  </p>
                  {/* Show Less Button */}
                  <button
                    onClick={handleToggle}
                    className="text-red-500 hover:underline font-medium text-[16px] "
                  >
                    Read Less
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
