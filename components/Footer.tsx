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
      <div className="relative -mb-1 translate-y-3 border border-gray-100  mx-auto px-6 py-4 w-[85%] sm:w-fit bg-white rounded-3xl shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-500 to-transparent opacity-30 rounded-3xl shadow-lg"></div>
        <h2 className="z-10 text-center text-lg md:text-3xl  font-extrabold text-gray-800">
          Your AI-Powered Passport to Global Education!
        </h2>
      </div>

      <footer className="bg-[#F1F1F1] text-gray-800 py-6 w-full flex justify-center rounded-t-[2rem] sm:rounded-t-[5rem]">
        <div className="footerChild w-[90%] lg:w-[95%] flex flex-col justify-center text-sm font-normal">
          {/* Grid-based Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[27%,25%,12%,12%,15%] gap-4 sm:gap-8 lg:gap-6 xl:gap-8">
            {/* Column 1: Logo + Socials */}
            <div className="flex flex-col items-center sm:items-start lg:items-center space-y-4">
              <Image
                src="/logowwah.svg"
                alt="WWAH Logo"
                width={100}
                height={100}
                className="h-auto w-[150px]"
              />
              <p className="text-center text-sm font-normal">
                Follow us for more
              </p>
              <div className="flex space-x-4">
                <Link href="https://www.facebook.com/share/1DgaYoeBCf/">
                  <FaFacebook className="text-blue-600 text-xl" />
                </Link>
                <Link href="https://www.instagram.com/wwah.ai/">
                  <FaInstagram className="text-red-600 text-xl" />
                </Link>
                <Link href="https://www.linkedin.com/company/wwah-ai">
                  <IoLogoLinkedin className="text-blue-600 text-xl" />
                </Link>
                <Link href="https://www.youtube.com/@intimestudyadvisors8015">
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
                <p className="text-sm font-normal">
                  info@worldwideadmissionshub.com
                </p>
              </div>
              {/* <div className="flex items-center space-x-3">
              <TfiWorld className="text-md min-w-[20px]" />
              <Link
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
                <Link href="/aboutUs" className="hover:underline block">
                  Why choose WWAH?
                </Link>
                <Link href="/partnerUS" className="hover:underline block">
                  Become a Partner
                </Link>
                <Link href="/contactus" className="hover:underline block">
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
                    <p>
                      These Terms and Conditions govern your use of our
                      website...
                    </p>
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
                    <Link href="/aboutUs" className="hover:underline block">
                      Why choose WWAH?
                    </Link>
                    <Link href="/partnerUS" className="hover:underline block">
                      Become a Partner
                    </Link>
                    <Link href="/contactus" className="hover:underline block">
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
                <Link href="/countries" className="hover:underline block">
                  Study Destination
                </Link>
                <Link href="/coursearchive" className="hover:underline block">
                  Courses
                </Link>
                <Link href="/Universities" className="hover:underline block">
                  Universities
                </Link>
                <Link href="/Scholarships" className="hover:underline block">
                  Scholarships
                </Link>
                <Link href="/chatmodel" className="hover:underline block">
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
                    <Link href="/countries" className="hover:underline block">
                      Study Destination
                    </Link>
                    <Link
                      href="/coursearchive"
                      className="hover:underline block"
                    >
                      Courses
                    </Link>
                    <Link
                      href="/Universities"
                      className="hover:underline block"
                    >
                      Universities
                    </Link>
                    <Link
                      href="/Scholarships"
                      className="hover:underline block"
                    >
                      Scholarships
                    </Link>
                    <Link href="/chatmodel" className="hover:underline block">
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
                <Link href="/trackexpense" className="hover:underline block">
                  Cost of Living Calculator
                </Link>
                <Link href="/schedulesession" className="hover:underline block">
                  WWAH Online counselling session
                </Link>
                <Link href="/ilets" className="hover:underline block">
                  IELTS Preparation
                </Link>
                <Link href="/pte" className="hover:underline block">
                  PTE Preparation
                </Link>
                <Link href="/toefl" className="hover:underline block">
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
                      href="/trackexpense"
                      className="hover:underline block"
                    >
                      Cost of Living Calculator
                    </Link>
                    <Link
                      href="/schedulesession"
                      className="hover:underline block"
                    >
                      WWAH Online counselling session
                    </Link>
                    <Link href="/ilets" className="hover:underline block">
                      IELTS Preparation
                    </Link>
                    <Link href="/pte" className="hover:underline block">
                      PTE Preparation
                    </Link>
                    <Link href="/toefl" className="hover:underline block">
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
