import Image from "next/image";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PartnershipServices() {
  return (
    <div className="PartnershipServices mt-8 w-full flex flex-col justify-center items-center">
      <h1 className="text-center">Why Partner with WWAH?</h1>
      <div className="serviceSection w-[90%] flex flex-col lg:flex-row justify-center gap-0 lg:gap-11">
        <div className="leftContent w-full lg:w-[48%] flex flex-col items-start">
          {/* Block 1 */}
          <div className="bg-white py-4 md:py-8">
            <div className="mx-auto">
              <h6 className="text-left">Earn with Every Enrollment</h6>
              <Accordion
                type="single"
                collapsible
                className="mt-4 sm:mt-8 md:space-y-4 grid grid-cols-1 sm:grid-cols-2 divide-y-0 border-0 md:gap-4 items-baseline"
              >
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="flex items-center text-left gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/icon-placeholder-1.svg"
                      alt="Icon 1"
                      width={40}
                      height={40}
                    />
                    <p>Referral Commission for Successful Student Placements</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Partners can earn a commission for each student successfully
                    placed at a university or institution through the WWAH
                    platform.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-0">
                  <AccordionTrigger className="flex items-center text-left gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/icon-placeholder-2.svg"
                      alt="Icon 2"
                      width={40}
                      height={40}
                    />
                    <p>Performance-Based Incentives</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    The more students an agent refers who successfully enroll in
                    a university, the greater the potential commission, which
                    encourages active participation and recruitment.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-0">
                  <AccordionTrigger className="flex items-center text-left gap-4 text-gray-800">
                    <Image
                      src="/partnerUs/icon-placeholder-3.svg"
                      alt="Icon 3"
                      width={40}
                      height={40}
                    />
                    <p>Bonus Payouts for Top-Performing Agents</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Partners who bring in a high number of qualified students
                    not only get higher commissions but also additional benefits
                    like bonus payouts or exclusive partnership deals with
                    premium institutions.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-0">
                  <AccordionTrigger className="flex items-center text-left gap-4 text-gray-800">
                    <Image
                      src="/partnerUs/icon-placeholder-4.svg"
                      alt="Icon 4"
                      width={40}
                      height={40}
                    />
                    <p>Cross-Promotion & Co-Marketing</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Partners can earn commissions by participating in co-branded
                    marketing campaigns with WWAH, helping them promote their
                    services while sharing the benefits of the portal.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="mt-16 flex justify-center">
              <Image
                src="/partnerUs/world-illustration-placeholder.svg"
                alt="World Illustration"
                width={545}
                height={300}
              />
            </div>
          </div>
          {/* Block 2 */}
          <div className="bg-white py-4 md:py-8 lg:py-16 w-full">
            <div className="mx-auto">
              <h6 className="text-left">Fast-Track Your Applications</h6>
              <Accordion
                type="single"
                collapsible
                className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 divide-y-0 border-0 md:gap-4 items-baseline"
              >
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/user-experience.svg"
                      alt="Icon 1"
                      width={40}
                      height={40}
                    />
                    <p>Enhanced User Experience</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    A simplified application process reduces the complexity and
                    time required for students to apply, making it easier for
                    partners to guide prospective students through the process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/real-time-update.svg"
                      alt="Icon 2"
                      width={40}
                      height={40}
                    />
                    <p>Real Time Updates</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Real-time updates ensure that partners have immediate access
                    to the status of student applications, making it easier for
                    them to communicate progress to prospective students.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 text-gray-800">
                    <Image
                      src="/partnerUs/document-manager.svg"
                      alt="Icon 3"
                      width={40}
                      height={40}
                    />
                    <p>Stay Organized with Our Document Manager</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Our Document Manager simplifies the application process.
                    With a clear checklist of required documents for each
                    application, you can upload everything in just seconds.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="mt-16 flex justify-center">
              <Image
                src="/partnerUs/fast-track.svg"
                alt="World Illustration"
                width={545}
                height={300}
              />
            </div>
          </div>
          {/* Block 3 */}
          <div className="bg-white py-4 md:py-8 lg:py-16 w-full">
            <div className="mx-auto">
              <h6 className="text-left">Tailored Support for You</h6>
              <Accordion
                type="single"
                collapsible
                className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 divide-y-0 border-0 gap-2 items-baseline"
              >
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="flex  items-center justify-start text-left gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/full-time-service.svg"
                      alt="Icon 1"
                      width={40}
                      height={40}
                    />
                    <p>24/7 Support</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    With our 24/7 service, you may get help whenever you need
                    it. To keep your business operations operating smoothly, our
                    team is committed to offering quick and effective solutions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-0">
                  <AccordionTrigger className="flex items-center justify-start text-left gap-4 text-gray-800">
                    <Image
                      src="/partnerUs/proactive-communication.svg"
                      alt="Icon 3"
                      width={40}
                      height={40}
                    />
                    <p>Proactive Communication</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Our Team keeps partners informed about any changes in
                    policies, new features, or available resources.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left md:gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/counselling-sessions.svg"
                      alt="Icon 2"
                      width={40}
                      height={40}
                    />
                    <p>Personalized Counseling Sessions</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    WWAH offers personalized virtual counseling sessions where
                    partners can discuss specific student needs, career advice,
                    and educational pathways.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        <div className="dividerImg hidden lg:flex items-center">
          <Image
            src="/partnerUs/partnershipServicesDivider.svg"
            alt="divider"
            width={29}
            height={400}
          />
        </div>
        <div className="rightContent w-full lg:w-[48%] flex flex-col items-start">
          {/* Block 1 */}
          <div className="bg-white py-4 md:py-8 lg:py-16 w-full">
            <div className="mb-16 flex justify-center">
              <Image
                src="/partnerUs/global-institutions.svg"
                alt="World Illustration"
                width={545}
                height={300}
              />
            </div>

            <div className="mx-auto">
              <h6 className="text-left">
                Expand Your Reach with Global Institutions
              </h6>
              <Accordion
                type="single"
                collapsible
                className="mt-4 sm:mt-8 md:space-y-4 grid grid-cols-1 sm:grid-cols-2 divide-y-0 border-0 md:gap-4 items-baseline"
              >
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/broader-student.svg"
                      alt="Icon 1"
                      width={40}
                      height={40}
                    />
                    <p>Broader Student Opportunities</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Partners can offer their students a vast array of academic
                    programs across multiple countries, making it easier to find
                    the right fit for diverse student profiles and interests.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/competitive-edge.svg"
                      alt="Icon 2"
                      width={40}
                      height={40}
                    />
                    <p>Competitive Edge</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Having access to more global institutions gives partners a
                    competitive advantage. They can differentiate themselves
                    from other agencies or educational advisors by offering more
                    options to students.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 text-gray-800">
                    <Image
                      src="/partnerUs/credibility.svg"
                      alt="Icon 3"
                      width={40}
                      height={40}
                    />
                    <p>Enhanced Branding and Credibility</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Being associated with a broad network of international
                    institutions boosts the credibility of partners in the eyes
                    of students and parents.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          {/* Block 2 */}
          <div className="bg-white py-4 md:py-8   w-full">
            <div className="mb-16 flex justify-center">
              <Image
                src="/partnerUs/applicants-tracking.svg"
                alt="World Illustration"
                width={545}
                height={300}
              />
            </div>
            <div className="mx-auto">
              <h6 className="text-left">Empower and Elevate Together</h6>
              <Accordion
                type="single"
                collapsible
                className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 divide-y-0 border-0 gap-4 items-baseline"
              >
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/Webinars-and-Workshops.svg"
                      alt="Icon 1"
                      width={40}
                      height={40}
                    />
                    <p>Webinars and Online Workshops</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Regular webinars and online workshops focused on best
                    practices in international student recruitment can help
                    partners stay updated on industry trends, effective
                    strategies, and university partnerships.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 font-medium text-gray-800">
                    <Image
                      src="/partnerUs/counselling-sessions.svg"
                      alt="Icon 2"
                      width={40}
                      height={40}
                    />
                    <p>Conversion Sessions</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Conversion-focused sessions can train partners on improving
                    their student conversion rates.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 text-gray-800">
                    <Image
                      src="/partnerUs/learning-material.svg"
                      alt="Icon 3"
                      width={40}
                      height={40}
                    />
                    <p>Learning Materials and Resources</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Partners will have access to a rich library of learning
                    materials, such as eBooks, guides, and articles with
                    in-depth knowledge on the education sector.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-0">
                  <AccordionTrigger className="flex justify-start items-center text-left gap-4 text-gray-800">
                    <Image
                      src="/partnerUs/Networking-Opportunities.svg"
                      alt="Icon 4"
                      width={40}
                      height={40}
                    />
                    <p>Networking Opportunities</p>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Partner networking events, allowing agents to collaborate,
                    share insights, and learn from one another.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          {/* Block 3 */}
          <div className="bg-white py-0 lg:py-16 w  -full">
            <div className="mb-0 lg:mb-16 flex justify-center">
              <Image
                src="/partnerUs/empowerAndElevate.svg"
                alt="World Illustration"
                width={545}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
