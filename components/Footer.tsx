"use client";
import { useState } from "react";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { IoCallOutline, IoMailUnreadOutline } from "react-icons/io5";
import { TfiWorld } from "react-icons/tfi";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import Link from "next/link";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Footer = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <footer className="bg-[#F1F1F1] text-gray-800 py-8 w-full flex justify-center">
      <div className="footerChild w-[90%]  flex flex-col justify-center">
        {/* Top Section */}
         <div className="text-center lg:text-left mb-4">
          <Image
            src="/logo.svg"
            alt="WWAH Logo"
            width={100}
            height={100}
            className="h-auto mx-auto lg:mx-0"
          />
        </div> 
      
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10 mb-6">

          {/* Left: Logo + Contact Info */}
          <div className="space-y-4 text-center md:text-left">
            {/* <div className="text-center lg:text-left mb-4">
              <Image
                src="/logo.svg"
                alt="WWAH Logo"
                width={100}
                height={100}
                className="h-auto mx-auto lg:mx-0"
              />
            </div> */}
            <div className="flex items-start text-start space-x-3">
              <CiLocationOn className="text-2xl min-w-[24px]" />
              <p className="text-sm leading-relaxed">
                12 Block F1, Main Boulevard, Khayaban-e-Firdousi, opposite to
                LDA Office, Johar Town, Lahore
              </p>
            </div>
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => (window.location.href = "tel:+923120762039")}
            >
              <IoCallOutline className="text-xl min-w-[20px]" />
              <p className="text-sm">03120762039</p>
            </div>
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() =>
                (window.location.href =
                  "mailto:info@worldwideadmissionshub.com")
              }
            >
              <IoMailUnreadOutline className="text-xl min-w-[20px]" />
              <p className="text-sm">info@worldwideadmissionshub.com</p>
            </div>
            <div className="flex items-center space-x-3">
              <TfiWorld className="text-xl min-w-[20px]" />
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                www.worldwideadmissionshub.com
              </Link>
            </div>
          </div>

          {/* Middle: Pages */}
          <div className="text-left md:block hidden">
            <p className="font-semibold mb-3">About WWAH</p>
            <div className="space-y-2">
              <Link href="/aboutUs" className="text-sm hover:underline block">
                Why choose WWAH?
              </Link>
              <Link href="/partnerUS" className="text-sm hover:underline block">
                Become a Partner
              </Link>
              <Link href="/contactus" className="text-sm hover:underline block">
                Contact Us
              </Link>
              {/* <Link href="/partnerUS" className="text-sm hover:underline block">
                Partner with Us
              </Link> */}
              <div className="space-y-2">
                {/* Terms & Conditions Modal */}
                <Dialog
                  open={openModal === "terms"}
                  onOpenChange={(isOpen) =>
                    setOpenModal(isOpen ? "terms" : null)
                  }
                >
                  <DialogTrigger asChild>
                    <p
                      className="text-sm hover:underline cursor-pointer"
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
                      These Terms and Conditions govern your use of our website
                      and services. By accessing our platform, you agree to
                      comply with these terms. Unauthorized use of this website
                      may give rise to a claim for damages.
                    </p>
                  </DialogContent>
                </Dialog>

                {/* Privacy Policy Modal */}
                <Dialog
                  open={openModal === "privacy"}
                  onOpenChange={(isOpen) =>
                    setOpenModal(isOpen ? "privacy" : null)
                  }
                >
                  <DialogTrigger asChild>
                    <p
                      className="text-sm hover:underline cursor-pointer"
                      onClick={() => setOpenModal("privacy")}
                    >
                      Privacy Policy
                    </p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Privacy Policy</DialogTitle>
                    </DialogHeader>
                    <p>
                      We are committed to protecting your privacy. Your personal
                      data is collected and processed securely, and we do not
                      share it with third parties without your consent. Learn
                      more about how we handle your information.
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="text-left  md:block hidden">
            <p className="font-semibold mb-3">Explore</p>
            <div className="space-y-2">
              <Link href="/countries" className="text-sm hover:underline block">
                Study Destination 
              </Link>
              <Link href="/coursearchive" className="text-sm hover:underline block">
                Courses
              </Link>
              <Link href="/Universities" className="text-sm hover:underline block">
                Universities
              </Link>
              <Link href="/Scholarships" className="text-sm hover:underline block">
                Scholarships
              </Link>
              <Link href="/chatmodel" className="text-sm hover:underline block">
                Chat with Zeus
              </Link>
              </div>
           
          </div>

          <div className="text-left  md:block hidden">
            <p className="font-semibold mb-3"> Test Preparation
</p>
            <div className="space-y-2">
              <Link href="/ilets" className="text-sm hover:underline block">
                IELTS
              </Link>
              <Link href="/pte" className="text-sm hover:underline block">
                PTE
              </Link>
              <Link href="/toefl" className="text-sm hover:underline block">
                TOEFL
              </Link>
            </div>
          </div>

          <div className="text-left  md:block hidden">
            <p className="font-semibold mb-3"> Useful Links</p>
            <div className="space-y-2">
              <Link href="/trackexpense" className="text-sm hover:underline block">
                Cost of Living Calculator 
              </Link>
              <Link href="/form" className="text-sm hover:underline block">
                Register for English Proficiency Tests
              </Link>
              <Link href="/schedulesession" className="text-sm hover:underline block">
                WWAH Online counselling session
              </Link>
            </div>
          </div>

          <Accordion type="multiple" className="w-full space-y-2 md:hidden block">
      {/* About WWAH */}
      <AccordionItem value="about-wwah">
        <AccordionTrigger className="font-semibold">About WWAH</AccordionTrigger>
        <AccordionContent className="space-y-2 text-sm">
          <Link href="/aboutUs" className="hover:underline block">Why choose WWAH?</Link>
          <Link href="/partnerUS" className="hover:underline block">Become a Partner</Link>
          <Link href="/contactus" className="hover:underline block">Contact Us</Link>

          {/* Terms & Conditions Modal */}
          <Dialog open={openModal === "terms"} onOpenChange={(isOpen) => setOpenModal(isOpen ? "terms" : null)}>
            <DialogTrigger asChild>
              <p className="hover:underline cursor-pointer" onClick={() => setOpenModal("terms")}>Terms & Conditions</p>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Terms & Conditions</DialogTitle>
              </DialogHeader>
              <p>
                These Terms and Conditions govern your use of our website and services. By accessing our platform, you agree to comply with these terms. Unauthorized use of this website may give rise to a claim for damages.
              </p>
            </DialogContent>
          </Dialog>

          {/* Privacy Policy Modal */}
          <Dialog open={openModal === "privacy"} onOpenChange={(isOpen) => setOpenModal(isOpen ? "privacy" : null)}>
            <DialogTrigger asChild>
              <p className="hover:underline cursor-pointer" onClick={() => setOpenModal("privacy")}>Privacy Policy</p>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Privacy Policy</DialogTitle>
              </DialogHeader>
              <p>
                We are committed to protecting your privacy. Your personal data is collected and processed securely, and we do not share it with third parties without your consent. Learn more about how we handle your information.
              </p>
            </DialogContent>
          </Dialog>
        </AccordionContent>
      </AccordionItem>

      {/* Explore */}
      <AccordionItem value="explore">
        <AccordionTrigger className="font-semibold">Explore</AccordionTrigger>
        <AccordionContent className="space-y-2 text-sm">
          <Link href="/countries" className="hover:underline block">Study Destination</Link>
          <Link href="/coursearchive" className="hover:underline block">Courses</Link>
          <Link href="/Universities" className="hover:underline block">Universities</Link>
          <Link href="/Scholarships" className="hover:underline block">Scholarships</Link>
          <Link href="/chatmodel" className="hover:underline block">Chat with Zeus</Link>
        </AccordionContent>
      </AccordionItem>

      {/* Test Preparation */}
      <AccordionItem value="test-prep">
        <AccordionTrigger className="font-semibold">Test Preparation</AccordionTrigger>
        <AccordionContent className="space-y-2 text-sm">
          <Link href="/ilets" className="hover:underline block">IELTS</Link>
          <Link href="/pte" className="hover:underline block">PTE</Link>
          <Link href="/toefl" className="hover:underline block">TOEFL</Link>
        </AccordionContent>
      </AccordionItem>

      {/* Useful Links */}
      <AccordionItem value="useful-links">
        <AccordionTrigger className="font-semibold">Useful Links</AccordionTrigger>
        <AccordionContent className="space-y-2 text-sm">
          <Link href="/trackexpense" className="hover:underline block">Cost of Living Calculator</Link>
          <Link href="/form" className="hover:underline block">Register for English Proficiency Tests</Link>
          <Link href="/schedulesession" className="hover:underline block">WWAH Online counselling session</Link>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
        </div>

        {/* Divider + Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 mt-4 space-y-4 sm:space-y-0">
          <div className="flex-1 border-t border-[#313131]"></div>
          <p className="text-center text-xs text-[#313131]">
            2025 Copyrights reserved by Worldwide Admissions Hub.
          </p>
          <div className="flex-1 border-t border-[#313131]"></div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center items-center mt-4 space-x-6">
          <Link href="https://www.facebook.com/share/1DgaYoeBCf/">
            <FaFacebook className="text-blue-600 text-2xl" />
          </Link>
          <Link href="https://www.instagram.com/wwah.ai/">
            <FaInstagram className="text-red-600 text-2xl" />
          </Link>
          <Link href="https://www.linkedin.com/company/wwah-ai">
            <IoLogoLinkedin className="text-blue-600 text-2xl" />
          </Link>
          <Link href="https://www.youtube.com/@intimestudyadvisors8015">
            <FaYoutube className="text-red-600 text-3xl" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
