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
      <div className="w-[90%] flex flex-col justify-center my-5 sm:mb-10">
        <h2 className="mb-2">Application Process!</h2>
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-4">
          <div className="space-y-2">
            {/* Step 1 */}
            <div>
              <h6>Create an Account</h6>
              <p className="text-gray-700 mt-2">
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
              <h6>Submit Your Application</h6>
              <p className="text-gray-700 mt-2">
                Complete your Personal and Educational details. Upload your
                documents and double-check all information before submission.
              </p>
            </div>
          </div>
          {/* Image with CTA */}
          <div className="relative bg-gray-100 p-4 w-full lg:w-[70%] rounded-lg shadow-md h-40 md:h-60 flex items-center justify-center my-1">
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
                className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 text-sm"
              >
                Learn About the Application Process
              </Link>
            </div>
          </div>
        </div>
        {/* Step 3 */}
        <div>
          <h6>Pay the Application Fee (If required)</h6>
          <p className="text-gray-700 mt-2">
            Make sure to pay the application fee (if applicable) to finalize
            your submission. Payment can be made easily directly to the
            university through bank, money exchangers, online apps, and WWAH
            secure online payment system.
          </p>
          {!isExpanded ? (
            <button
              onClick={handleToggle}
              className="text-red-500 hover:underline font-medium text-[16px] "
            >
              Read More
            </button>
          ) : (
            <>
              {/* Step 4 */}
              <div>
                <h6>Track Your Application</h6>
                <p className="text-gray-700 mt-2">
                  Once your application is submitted, you can monitor its
                  progress through your personalized WWAH dashboard. Stay
                  informed with real-time updates and notifications.
                </p>
              </div>
              {/* Step 5 */}
              <div>
                <h6>Receive Your Offer Letter</h6>
                <p className="text-gray-700 mt-2">
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
                <h6>Apply for a Visa</h6>
                <p className="text-gray-700 mt-2">
                  Once you&apos;ve accepted an offer and received your visa
                  letter, start the visa application process. We&apos;ll provide
                  guidance and resources to help you secure your student visa.
                  For {countryname} Visa Application requirements and process,{" "}
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
                <h6>Plan Your Arrival</h6>
                <p className="text-gray-700 mt-2">
                  After your visa is approved, begin planning your journey. WWAH
                  offers tips on accommodation, travel, and settling into your
                  new environment.
                </p>
              </div>
              {/* Step 8 */}
              <div>
                <h6>Begin Your Academic Journey</h6>
                <p className="text-gray-700 mt-2">
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};
