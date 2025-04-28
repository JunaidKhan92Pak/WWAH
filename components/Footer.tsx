"use client";
import { useState } from "react";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import {
  IoCallOutline,
  IoMailUnreadOutline,
  IoLogoLinkedin,
} from "react-icons/io5";

import { FaFacebook, FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { PiHouseLineBold } from "react-icons/pi";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Footer = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <>
      <div className="relative -mb-1 translate-y-3   mx-auto md:px-6 py-3 md:py-4 w-[85%] sm:w-fit bg-white rounded-3xl ">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-400 to-transparent opacity-30 rounded-3xl "></div>
        <h5 className="z-10 text-center   font-extrabold text-gray-800">
          Global Education, Powered by AI
        </h5>
      </div>

      <footer className="bg-[#F1F1F1] text-gray-800 pt-10 pb-6 md:py-10 w-full flex justify-center rounded-t-[2rem] sm:rounded-t-[5rem]">
        <div className="footerChild w-[90%] lg:w-[95%] flex flex-col justify-center text-sm font-normal">
          {/* Grid-based Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[27%,25%,12%,12%,15%] gap-4 sm:gap-8 lg:gap-6 xl:gap-8">
            {/* Column 1: Logo + Socials */}
            <div className="flex flex-col items-center sm:items-start lg:items-center space-y-4">
              <Image
                src="/wwah-textb.svg"
                alt="WWAH Logo"
                width={100}
                height={100}
                className="h-auto w-[150px]"
              />
              <p className="text-center text-sm font-normal">
                Follow us for more
              </p>
              <div className="flex space-x-4">
                <Link
                  target="_blank"
                  href="https://www.facebook.com/share/1671drwb7r/?mibextid=wwXIfr"
                >
                  <FaFacebook className="text-blue-600 text-xl" />
                </Link>
                <Link target="blank" href="https://www.instagram.com/wwah.ai/">
                  <FaInstagram className="text-red-600 text-xl" />
                </Link>
                <Link
                  target="blank"
                  href="https://www.linkedin.com/company/wwah-ai"
                >
                  <IoLogoLinkedin className="text-blue-600 text-xl" />
                </Link>
                <Link
                  target="blank"
                  href="https://youtube.com/@worldwideadmissionshub-l3r?si=PlJn6vHNsFzCGVPv"
                >
                  <FaYoutube className="text-red-600 text-xl" />
                </Link>
              </div>
            </div>

            {/* Column 2: Contact Info */}
            <div className="space-y-3 text-center">
              <div className="flex items-start space-x-3 text-justify sm:text-start">
                <PiHouseLineBold className="text-xl min-w-[23px]" />
                <p className="text-sm font-normal">
                  Head Office: Al Waheeda , Dubai.
                </p>
              </div>
              <div className="flex items-start space-x-3 text-justify sm:text-start">
                <CiLocationOn className="text-xl min-w-[20px]" />
                <p className="text-sm font-normal">
                  Coney Island Ave, Brooklyn, NY 11235, USA
                </p>
              </div>
              <div className="flex items-start space-x-3 text-justify sm:text-start">
                <CiLocationOn className="text-xl min-w-[20px]" />
                <p className="text-sm font-normal">Stockport Manchester,UK</p>
              </div>

              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => (window.location.href = "tel:+923120762039")}
              >
                <IoCallOutline className="text-xl min-w-[20px]" />
                <p className="text-sm font-normal">+971582514675</p>
              </div>
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() =>
                  (window.location.href =
                    "mailto:info@worldwideadmissionshub.com")
                }
              >
                <IoMailUnreadOutline className="text-xl min-w-[20px]" />
                <p className="text-sm font-normal">info@wwah.ai</p>
              </div>
              {/* <div className="flex items-center space-x-3">
              <TfiWorld className="text-md min-w-[20px]" />
              <Link target="blank"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <p className="text-sm hover:underline">
                  www.worldwideadmissionshub.com
                </p>
              </Link>
            </div> */}
            </div>

            {/* Column 3: About WWAH (LG and up) */}
            <div className="text-left hidden lg:block">
              <p className="font-semibold mb-3">About WWAH</p>
              <div className="space-y-2">
                <Link
                  target="blank"
                  href="/aboutUs"
                  className="hover:underline block"
                >
                  Why choose WWAH?
                </Link>
                <Link
                  target="blank"
                  href="/partnerUS"
                  className="hover:underline block"
                >
                  Become a Partner
                </Link>
                <Link
                  target="blank"
                  href="/contactus"
                  className="hover:underline block"
                >
                  Contact Us
                </Link>
                <Dialog
                  open={openModal === "terms"}
                  onOpenChange={(isOpen) =>
                    setOpenModal(isOpen ? "terms" : null)
                  }
                >
                  <DialogTrigger asChild>
                    <p
                      className="hover:underline cursor-pointer text-sm font-normal"
                      onClick={() => setOpenModal("terms")}
                    >
                      Terms & Conditions
                    </p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Terms & Conditions</DialogTitle>
                    </DialogHeader>
                    <div className="h-56 overflow-y-auto">
                      <p>
                        Welcome to WWAH (“we”, “our”, “us”), a platform designed
                        to help students explore and apply to universities
                        worldwide. By accessing or using our website and
                        services, you (“you”, “user”, “student”) agree to be
                        bound by these Terms and Conditions. Please read them
                        carefully.
                      </p>
                      <p className="font-semibold">1. Acceptance of Terms</p>
                      <p>
                        By creating an account, using any service, or browsing
                        the website, you agree to these Terms and Conditions,
                        our Privacy Policy, and all applicable laws and
                        regulations. You cannot be exempted from following all
                        terms and conditions under any circumstances.
                      </p>
                      <p className="font-semibold">2. Disclaimer Notice</p>
                      <p>
                        You are using this website and all of its including
                        services at your own risk. The information, materials,
                        content, and services are subject to change according to
                        the relevant countries &#39; and universities&#39;
                        policy amendments. We do not guarantee visa approvals,
                        it is solely dependent on concerned governments and
                        their relevant departments. Any transactions made on or
                        from our website must be reviewed by the users
                        beforehand, and cannot be disputed later for any reason.
                        We are not liable for any direct, indirect, deliberate,
                        or incidental damages or breach from systems failure,
                        theft, or unauthorized access.
                      </p>
                      <p className="font-semibold">3. Eligibility</p>
                      <p>
                        To use our services, you must:  Be at least 16 years
                        old or have parental/guardian consent.  Use the
                        services for educational purposes only.
                      </p>
                      <p>
                        You are not allowed to commit any fraudulent, unlawful,
                        or harmful activity on or with this website. If you
                        misuse our site or services, we can terminate your
                        account without any prior notice. You will not be
                        allowed to recreate or retrieve the account if we
                        suspend your account with such serious allegations.
                      </p>
                      <p className="font-semibold">
                        4. Account Creation and Profile Management
                      </p>
                      <p>
                        You must provide accurate, complete, and current
                        information when creating your profile. You are also
                        responsible for maintaining the confidentiality of your
                        account and password.
                      </p>
                      <p>
                        The information you provide will be used for following
                        purposes:
                      </p>
                      <p>
                         Match you with suitable universities and their
                        programs, according to your preferences.  Recommend
                        scholarships and funding opportunities.  Generate
                        cost-of-living estimates and a complete list of
                        documents required (for universities and embassies of
                        respective countries).
                      </p>
                      <p className="font-semibold">5. Application Assistance</p>
                      <p>
                        We provide step-by-step assistance with university
                        applications, including:
                      </p>
                      <p>
                         Document preparation  Statement of purpose guidance 
                        Application deadline reminders  Submission tracking
                      </p>
                      <p>
                        You can access any and all resources that are uploaded
                        onto the website. You may also book counseling sessions
                        or ask for assistance through any of the official
                        mediums. You can expect complete privacy and support to
                        meet all your application requirements within reason.
                      </p>
                      <p>
                        *Users are responsible for ensuring accuracy and
                        truthfulness of all application materials.
                      </p>
                      <p className="font-semibold">5. Application Assistance</p>
                      <p>
                        We provide step-by-step assistance with university
                        applications, including:
                      </p>
                      <p>
                         Document preparation  Statement of purpose guidance 
                        Application deadline reminders  Submission tracking
                      </p>
                      <p>
                        You can access any and all resources that are uploaded
                        onto the website. You may also book counseling sessions
                        or ask for assistance through any of the official
                        mediums. You can expect complete privacy and support to
                        meet all your application requirements within reason.
                      </p>
                      <p className="font-semibold">
                        6. Scholarship and Financial Aid Matching
                      </p>
                      <p>
                        Our AI will match you with scholarships based on
                        eligibility, deadlines, and availability. We do not
                        guarantee scholarships solely by the use of our
                        platform. Application to scholarships may be facilitated
                        through our platform or through direct external links.
                        You are expected to monitor the success chances but are
                        not restricted to apply to any universities or programs.
                        It is completely upon your discretion to send as many
                        applications as you want.
                      </p>
                      <p className="font-bold">7. Visa and Embassy Guidance</p>
                      <p>
                        {" "}
                        Visa and embassy guidelines are always changing and
                        upgrading. Our platform offers latest information and
                        guides on:
                      </p>
                      <p>
                         Types of student visas for various countries  Embassy
                        appointments  Required documents  Travel regulations
                      </p>
                      <p>
                        You are given access to numerous resources that provide
                        relevant information according to your needs. Any abrupt
                        changes in policies will be notified and may affect your
                        application directly.{" "}
                      </p>
                      <p>
                        Necessary measures will be taken to facilitate students
                        according to the newly-imposed regulations. But, it must
                        be noted here that any application not filed before new
                        policy implementation will be changed accordingly (if
                        applicable).
                      </p>
                      <em>
                        *We do not represent any embassy or government body and
                        cannot influence visa decisions.
                      </em>
                      <p className="font-bold">8. Cost and Expense Analysis</p>
                      <p>
                        Our cost analysis tools provide probable estimates for:
                      </p>
                      <p>
                         Tuition fees  Travel expenses  Living expenses,
                        including its breakdown
                      </p>
                      <p>
                        *These are approximate values and subject to change.
                      </p>
                      <p>
                        They will guide you on how much money you need to
                        earn/save in order to pay the bills and expenses. As it
                        is an approximation, it may show differing values
                        sometimes. The program may also give wrong estimate or
                        lag behind due to error(s) at any time. You can report
                        any issues to our team and they will fix it as soon as
                        possible
                      </p>
                      <p className="font-bold">9. Counselling Sessions</p>
                      <p>
                        Personalized academic and career counseling is
                        available. Sessions may be conducted via chat, video, or
                        in-person (if and where available). You can find
                        counselling session charges at this link.
                      </p>
                      <p>
                        They are paid sessions for users upon request. You are
                        not allowed to ask for refund after availing the service
                        for any reason. However, we have the right to reimburse
                        students if and when we are unable to provide service or
                        encounter any issues that we deem inappropriate.
                      </p>
                      <p>
                        You will get banned or suspended from using our services
                        if you are found:
                      </p>
                      <p>
                         Behaving inappropriately with our staff.  Fail to
                        show up or log in to sessions repeatedly.  Guilty of
                        harassment of any kind.
                      </p>
                      <p className="font-bold">
                        10. Transportation and Airport Assistance
                      </p>
                      <p>
                        We do not provide transportation services ourselves and
                        will be hiring/collaborating with third-parties. Their
                        optional services may include:
                      </p>
                      <p>
                         Airport pickup arrangements  Guidance for local
                        transport and temporary accommodation
                      </p>
                      <p>
                        *These services may be fulfilled by third-party
                        providers. We do not guarantee availability or quality.
                        However, you are encouraged to provide feedback on the
                        services and if there is anything we can do to make your
                        travel/accommodation process smoother.
                      </p>
                      <p className="font-bold">11. User Conduct</p>
                      <p>You agree not to:</p>
                      <p>
                         Misrepresent your identity.  Forge academic
                        qualifications.  Upload harmful, illegal, or
                        plagiarized content.  Attempt to breach or bypass any
                        security feature.  Use the platform for commercial,
                        fraudulent, or unlawful purposes.
                      </p>
                      <p>
                        Also, you are encouraged to inform or contact us if you
                        become aware of any potential threats or misuse of this
                        website. You can contact us through our email, phone
                        number, or any social media platforms you may prefer.
                      </p>
                      <p className="font-bold">
                        Third-Party Services and Links
                      </p>
                      <p>
                        Our platform may contain links to third-party services
                        (universities, scholarship providers etc.). We are not
                        responsible for the content, policies, or services of
                        any of these third-party sites. Access or use them at
                        your own risk.
                      </p>
                      <p className="font-bold">13. Intellectual Property</p>
                      <p>
                        All content on the platform, including text, graphics,
                        videos, and data, is the property of WWAH and protected
                        by applicable laws. You are not authorized to plagiarize
                        or copy anything.
                      </p>
                      <p className="font-bold">14. Limitation of Liabilities</p>
                      <p>
                        We strive for accuracy, but we offer no guarantees
                        regarding outcomes, acceptances, scholarships, or visa
                        approvals. We are not liable for any direct or indirect
                        harmful effect that results from the use of our
                        services.
                      </p>
                      <p className="font-bold">15. Termination of Access</p>
                      <p>
                        We reserve the right to terminate or suspend your access
                        and/or account for violation of the given Terms or due
                        to suspicious activity. You possess the right to delete
                        your account at any time via account settings.
                      </p>
                      <p className="font-bold">16. Changes to Terms</p>
                      <p>
                        We may modify these Terms from time to time. You will be
                        notified of any major changes via email or website
                        notice. Continued use after notice will be considered
                        acceptance of those changes.
                      </p>
                      <p className="font-bold">17. Contact Us</p>
                      <p>For questions or concerns, please contact us at:</p>
                      <p className="font-semibold">
                        WWAH - World Wide Admissions Hub{" "}
                      </p>
                      <p>
                        Email:<Link href="/info@wwah.ao"> info@wwah.ai </Link>
                      </p>
                      <p>Phone: +971 582514675</p>
                      <p>Terms and Conditions Posted on 28/04/2025</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={openModal === "privacy"}
                  onOpenChange={(isOpen) =>
                    setOpenModal(isOpen ? "privacy" : null)
                  }
                >
                  <DialogTrigger asChild>
                    <p
                      className="hover:underline cursor-pointer text-sm font-normal"
                      onClick={() => setOpenModal("privacy")}
                    >
                      Privacy Policy
                    </p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Privacy Policy</DialogTitle>
                    </DialogHeader>
                    <p>We are committed to protecting your privacy...</p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Accordion: About WWAH */}
            <div className="block lg:hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value="about">
                  <AccordionTrigger>About WWAH</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <Link
                      target="blank"
                      href="/aboutUs"
                      className="hover:underline block"
                    >
                      Why choose WWAH?
                    </Link>
                    <Link
                      target="blank"
                      href="/partnerUS"
                      className="hover:underline block"
                    >
                      Become a Partner
                    </Link>
                    <Link
                      target="blank"
                      href="/contactus"
                      className="hover:underline block"
                    >
                      Contact Us
                    </Link>
                    <Dialog
                      open={openModal === "terms"}
                      onOpenChange={(isOpen) =>
                        setOpenModal(isOpen ? "terms" : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <p
                          className="hover:underline cursor-pointer text-sm font-normal"
                          onClick={() => setOpenModal("terms")}
                        >
                          Terms & Conditions
                        </p>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Terms & Conditions</DialogTitle>
                        </DialogHeader>
                        <p>These Terms and Conditions govern your use...</p>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={openModal === "privacy"}
                      onOpenChange={(isOpen) =>
                        setOpenModal(isOpen ? "privacy" : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <p
                          className="hover:underline cursor-pointer text-sm font-normal"
                          onClick={() => setOpenModal("privacy")}
                        >
                          Privacy Policy
                        </p>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Privacy Policy</DialogTitle>
                        </DialogHeader>
                        <p>We are committed to protecting your privacy...</p>
                      </DialogContent>
                    </Dialog>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Column 4: Explore (LG only) */}
            <div className="text-left hidden lg:block">
              <p className="font-semibold mb-3">Explore</p>
              <div className="space-y-2">
                <Link
                  target="blank"
                  href="/countries"
                  className="hover:underline block"
                >
                  Study Destination
                </Link>
                <Link
                  target="blank"
                  href="/coursearchive"
                  className="hover:underline block"
                >
                  Courses
                </Link>
                <Link
                  target="blank"
                  href="/Universities"
                  className="hover:underline block"
                >
                  Universities
                </Link>
                <Link
                  target="blank"
                  href="/Scholarships"
                  className="hover:underline block"
                >
                  Scholarships
                </Link>
                <Link
                  target="blank"
                  href="/chatmodel"
                  className="hover:underline block"
                >
                  Chat with Zeus
                </Link>
              </div>
            </div>

            {/* Accordion: Explore */}
            <div className="block lg:hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value="explore">
                  <AccordionTrigger>Explore</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <Link
                      target="blank"
                      href="/countries"
                      className="hover:underline block"
                    >
                      Study Destination
                    </Link>
                    <Link
                      target="blank"
                      href="/coursearchive"
                      className="hover:underline block"
                    >
                      Courses
                    </Link>
                    <Link
                      target="blank"
                      href="/Universities"
                      className="hover:underline block"
                    >
                      Universities
                    </Link>
                    <Link
                      target="blank"
                      href="/Scholarships"
                      className="hover:underline block"
                    >
                      Scholarships
                    </Link>
                    <Link
                      target="blank"
                      href="/chatmodel"
                      className="hover:underline block"
                    >
                      Chat with Zeus
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Column 5: Useful Links (LG only) */}
            <div className="text-left hidden lg:block">
              <p className="font-semibold mb-3">Useful Links</p>
              <div className="space-y-2">
                <Link
                  target="blank"
                  href="/trackexpense"
                  className="hover:underline block"
                >
                  Cost of Living Calculator
                </Link>
                <Link
                  target="blank"
                  href="/schedulesession"
                  className="hover:underline block"
                >
                  WWAH Online counselling session
                </Link>
                <Link
                  target="blank"
                  href="/ilets"
                  className="hover:underline block"
                >
                  IELTS Preparation
                </Link>
                <Link
                  target="blank"
                  href="/pte"
                  className="hover:underline block"
                >
                  PTE Preparation
                </Link>
                <Link
                  target="blank"
                  href="/toefl"
                  className="hover:underline block"
                >
                  TOEFL Preparation
                </Link>
              </div>
            </div>

            {/* Accordion: Useful Links */}
            <div className="block lg:hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value="useful">
                  <AccordionTrigger>Useful Links</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <Link
                      target="blank"
                      href="/trackexpense"
                      className="hover:underline block"
                    >
                      Cost of Living Calculator
                    </Link>
                    <Link
                      target="blank"
                      href="/schedulesession"
                      className="hover:underline block"
                    >
                      WWAH Online counselling session
                    </Link>
                    <Link
                      target="blank"
                      href="/ilets"
                      className="hover:underline block"
                    >
                      IELTS Preparation
                    </Link>
                    <Link
                      target="blank"
                      href="/pte"
                      className="hover:underline block"
                    >
                      PTE Preparation
                    </Link>
                    <Link
                      target="blank"
                      href="/toefl"
                      className="hover:underline block"
                    >
                      TOEFL Preparation
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Divider + Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 mt-2 space-y-4 sm:space-y-0">
            <div className="flex-1 border-t border-gray-800"></div>
            <p className="text-center text-xs text-[#313131]">
              2025 Copyrights reserved by Worldwide Admissions Hub.
            </p>
            <div className="flex-1 border-t border-gray-800"></div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
