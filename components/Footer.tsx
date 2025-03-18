import React from "react";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { IoCallOutline, IoMailUnreadOutline } from "react-icons/io5";
import { TfiWorld } from "react-icons/tfi";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#F1F1F1] text-gray-800 py-8 w-full flex justify-center">
      <div className="footerChild flex flex-col w-[90%] justify-center ">
        {/* Top Section */}
        <div className="text-center lg:text-left mb-4">
          <Image
            src="/logo.png"
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
            <div className="flex items-center space-x-4">
              <IoCallOutline />
              <p className="text-sm 2xl:text-base">92 328 99 11 998</p>
            </div>
            <div className="flex items-center space-x-4">
              <IoMailUnreadOutline />
              <p className="text-sm 2xl:text-base">info@worldwidehub.com</p>
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
                <p className="text-sm 2xl:text-base hover:underline cursor-pointer">
                  Terms & Conditions
                </p>
                <p className="text-sm 2xl:text-base hover:underline cursor-pointer">
                  Privacy Policy
                </p>
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
          <Link href="#">
           
            <FaFacebook className="text-blue-600 text-2xl"/>
          </Link>
          <Link href="#">
           
            <FaInstagram className="text-red-600 text-2xl"/>
          </Link>
          <Link href="#">
            <IoLogoLinkedin className="text-blue-600 text-2xl"/>
           
          </Link>
          <Link href="#">
            <FaYoutube className="text-3xl text-red-600"/>

          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
