"use client";

import { useState } from "react";
import Image from "next/image";
// import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Mission() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  console.log(toggleReadMore);
  
  return (
    <section className="bg-gray-50 md:py-6 w-full">
      <div className="w-[90%] mx-auto">
        <h2 className=" text-gray-800 text-center py-5">What we stand for?</h2>
        {/* row 1 */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
          {/* Image Section */}
          <div className="w-full md:w-[50%]">
            <Image
              src="/mission.png"
              alt="Missionicon"
              className="w-full"
              width={683}
              height={297}
            />
          </div>

          {/* Text Section */}
          <div className="text-center md:text-left w-full md:w-[50%] pl-0 md:pl-8">
            <h4 className=" text-gray-900 mb-2">Our Mission!</h4>
            <p className="text-gray-700 text-justify leading-snug w-full lg:w-[85%]">
              At World Wide Admissions Hub (WWAH), our mission is to redefine
              the global admissions experience by bridging the gap between
              students and institutions through technology, transparency and
              empathy.
            </p>
          </div>
        </div>
        {/* row 2 */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-2 md:gap-0">
          {/* Text Section */}
          <div className="text-center md:text-left w-full md:w-[50%] ">
            <h4 className=" text-gray-900 mb-2">Our Vision!</h4>
            <p className="text-gray-700 text-justify leading-snug w-full lg:w-[85%] pr-4">
              Our vision is to become the most trusted, student-centric global
              admissions platform in emerging and underserved markets one that
              transforms how students plan, prepare, and succeed in their
              academic journeys abroad.
            </p>
          </div>
          {/* Image Section */}
          <div className="w-full md:w-[50%]">
            <Image
              src="/vision.png"
              alt="visionicon"
              className="w-full"
              width={683}
              height={297}
            />
          </div>
        </div>
        {/* row 3 */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-0">
          {/* Image Section */}
          <div className="w-full md:w-[50%]">
            <Image
              src="/values.png"
              alt="Missionicon"
              className="w-full"
              width={683}
              height={297}
            />
          </div>

          {/* Text Section */}
          <div className="text-center md:text-left w-full md:w-[50%] pl-0 md:pl-8 pb-5 md:pb-0">
            <h4 className="text-gray-900 mb-0">Our Values!</h4>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="innovation">
                <AccordionTrigger>Innovation</AccordionTrigger>
                <AccordionContent>
                  We embrace continuous innovation by blending cutting-edge AI
                  technology with expert human support, delivering a seamless,
                  modern admissions experience that evolves with student needs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="transparency">
                <AccordionTrigger>Transparency</AccordionTrigger>
                <AccordionContent>
                  We believe in building trust through clarity. Every student
                  deserves an honest, straightforward process from the first
                  search to final enrollment.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="empowerment">
                <AccordionTrigger>Empowerment</AccordionTrigger>
                <AccordionContent>
                  Our platform is designed to help students make informed,
                  confident decisions about their academic future and career
                  path.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="partnership">
                <AccordionTrigger>Partnership</AccordionTrigger>
                <AccordionContent>
                  We establish mutually beneficial relationships with
                  institutions, counselors, and educators, working together to
                  expand opportunity and impact.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="support">
                <AccordionTrigger>Support</AccordionTrigger>
                <AccordionContent>
                  From shortlisting the right university to visa guidance and
                  post-admission care, ZEUS provides 24/7 comprehensive,
                  end-to-end support tailored to each student’s journey.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mission;
