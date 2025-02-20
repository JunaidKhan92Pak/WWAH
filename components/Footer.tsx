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

        {/* Main Content: Left Section (Contact Details) & Right Section (Links) */}
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
            {/* Pages */}
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

        {/* Social Icons Section */}

        <div className="flex justify-center items-center mt-4 space-x-6">
          <Link href="#">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              style={{ color: "#1877f2" }}
              viewBox="0 0 24 24"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg> */}
            <FaFacebook className="text-blue-600 text-2xl"/>
          </Link>
          <Link href="#">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              style={{ color: "#c13584" }}
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg> */}
            <FaInstagram className="text-red-600 text-2xl"/>
          </Link>
          <Link href="#">
            <IoLogoLinkedin className="text-blue-600 text-2xl"/>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              style={{ color: "#0077b5" }}
              viewBox="0 0 24 24"
            >
              <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
            </svg> */}
          </Link>
          <Link href="#">
            <FaYoutube className="text-3xl text-red-600"/>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="currentColor"
              style={{ color: "#ff0000" }}
              viewBox="0 0 24 24"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg> */}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
