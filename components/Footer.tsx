"use client";
import { useState } from "react";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { IoCallOutline, IoMailUnreadOutline } from "react-icons/io5";
import { TfiWorld } from "react-icons/tfi";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Footer = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  return (
    <footer className="bg-[#F1F1F1] text-gray-800 py-8 w-full flex justify-center">
      <div className="footerChild flex flex-col w-[90%] justify-center ">
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

        <div className="grid grid-col-1 sm:grid-cols-[60%,40%] gap-4 lg:place-items-center">
          {/* Left Section: Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-start">
            <div className="flex  space-x-4">
              <CiLocationOn className="h-8  sm:h-12 lg:h-8 w-8 sm:w-12 lg:w-8" />
              <p className="text-sm 2xl:text-base">
                12 Block F1, Main Boulevard, Khayaban-e-Firdousi, opposite to
                LDA Office, Johar Town, Lahore
              </p>
            </div>
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() =>
                window.open("https://wa.me/923289911998", "_blank")
              }
            >
              <IoCallOutline />
              <p className="text-sm 2xl:text-base">92 328 99 11 998</p>
            </div>
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() =>
                (window.location.href =
                  "mailto:info@worldwideadmissionshub.com")
              }
            >
              <IoMailUnreadOutline />
              <p className="text-sm 2xl:text-base">
                info@worldwideadmissionshub.com
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <TfiWorld />
              <p className="text-sm 2xl:text-base">www.worldwidehub.com</p>
            </div>
          </div>

          {/* Right Section: Links */}
          <div className="grid grid-cols-2 gap-8 text-left">
            <div>
              <p className="font-semibold mb-2">Pages</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p className="text-sm 2xl:text-base hover:underline cursor-pointer">
                  <Link href="/aboutUs">About Us</Link>
                </p>
                <p className="text-sm 2xl:text-base hover:underline cursor-pointer">
                  <Link href="/partnerUS">Partner with Us</Link>
                </p>
                <p className="text-sm 2xl:text-base hover:underline cursor-pointer">
                  <Link href="/contactus">Contact Us</Link>
                </p>
              </div>
            </div>
            {/* Other Pages */}
            <div>
              <p className="font-semibold mb-2">Other Pages</p>
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
                      className="text-sm 2xl:text-base hover:underline cursor-pointer"
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
                      className="text-sm 2xl:text-base hover:underline cursor-pointer"
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
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 mt-4 space-y-4 sm:space-y-0">
          <div className="flex-1 border-t border-[#313131]"></div>
          <p className="text-center text-xs text-[#313131]">
            2024 Copyrights reserved by Worldwide Admissions Hub.
          </p>
          <div className="flex-1 border-t border-[#313131]"></div>
        </div>

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
            <FaYoutube className="text-3xl text-red-600" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
