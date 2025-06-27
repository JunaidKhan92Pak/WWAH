"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
// import { CiLocationOn } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import {
  IoCallOutline,
  IoMailUnreadOutline,
  IoLogoLinkedin,
} from "react-icons/io5";

import { FaFacebook, FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
// import { PiHouseLineBold } from "react-icons/pi";
import { AiOutlineHome } from "react-icons/ai";
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
const [openModal, setOpenModal] = useState<string | null>(null);        // for lg and up
const [accordionModal, setAccordionModal] = useState<string | null>(null); // for md and down

useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;

    // lg and up
    if (width >= 1024) {
      if (accordionModal) setAccordionModal(null); // close mobile modal
    } else {
      if (openModal) setOpenModal(null); // close desktop modal
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize(); // Run on mount

  return () => window.removeEventListener("resize", handleResize);
}, [openModal, accordionModal]);
const openGmail = () => {
  window.open(
    "https://mail.google.com/mail/?view=cm&to=info@wwah.ai",
    "_blank",
    "noopener,noreferrer"
  );
};

  return (
    <>
      <div className="relative -mb-1 translate-y-3   mx-auto md:px-6 py-3 md:py-4 w-[85%] sm:w-fit bg-white rounded-3xl ">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-400 to-transparent opacity-30 rounded-3xl "></div>
        <h5 className="z-10 text-center leading-5  font-extrabold text-gray-800">
          Your study abroad journey, simplified with AI{" "}
        </h5>
      </div>

      <footer className="bg-[#F1F1F1] text-gray-800 pt-10 pb-6 md:py-10 w-full flex justify-center rounded-t-[2rem] sm:rounded-t-[5rem]">
        <div className="footerChild w-[90%] lg:w-[95%] flex flex-col justify-center text-sm font-normal">
          {/* Grid-based Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[20%,25%,16%,12%,17%] xl:grid-cols-[22%,25%,12%,12%,15%] gap-4 sm:gap-8 lg:gap-6 xl:gap-8">
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
                <AiOutlineHome className="text-xl min-w-[23px] " />
                <p className="text-sm font-normal">
                  Head Office: Al Waheeda, Dubai.
                </p>
              </div>
              <div className="flex items-start space-x-3 text-justify sm:text-start">
                <IoLocationOutline className="text-xl min-w-[20px]" />
                <p className="text-sm font-normal">
                  Coney Island Ave, Brooklyn, NY 11235, USA
                </p>
              </div>
              <div className="flex items-start space-x-3 text-justify sm:text-start">
                <IoLocationOutline className="text-xl min-w-[20px]" />
                <p className="text-sm font-normal">Stockport Manchester, UK</p>
              </div>

              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => (window.location.href = "tel:+923120762039")}
              >
                <IoCallOutline className="text-xl min-w-[20px]" />
                <p className="text-sm font-normal"> +971 50 578 4006</p>
              </div>
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() =>
                (window.location.href =
                  "mailto:info@worldwideadmissionshub.com")
                }
              >
                <IoMailUnreadOutline className="text-xl min-w-[20px]" />
<p
  className="text-sm font-normal hover:underline cursor-pointer"
  onClick={openGmail}
>
  info@wwah.ai
</p>

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
                    <div className="lg:max-h-[70vh] xl:max-h-[75vh] overflow-y-auto">
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
                    <div className="lg:max-h-[70vh] xl:max-h-[75vh] overflow-y-auto">
                      <p>
                        Welcome to WWAH (“we,” “our,” or “us”). Your privacy is
                        important to us. This Privacy Policy explains how we
                        collect, use, disclose, and safeguard your information
                        when you visit our AI-powered study abroad platform (the
                        “Service”), which provides personalized recommendations
                        for universities, courses, scholarships, and counseling
                        services.
                      </p>
                      <p>
                        By using our website, you consent to the privacy policy
                        terms mentioned ahead.
                      </p>
                      <p className="font-bold">
                        1. Why Do We Collect Information?
                      </p>
                      <p>
                        We collect your personal information to identify your
                        personal preferences and let our AI platform match you
                        up with different universities that have the highest
                        probability of accepting you into theirs program. It
                        helps us deliver better service to you, in accordance
                        with your needs and desires. Also, we may use it to keep
                        you updated of the developments in the field of
                        education or to inform of your latest news and events
                        that may be in your interests.
                      </p>
                      <p className="font-bold">
                        2. How Do We Use Your Information?
                      </p>
                      <p>We use your data to:</p>
                      <p>
                         Provide tailored university, course, and scholarship
                        matches using AI-based algorithms  Offer personalized
                        counseling recommendations  Facilitate virtual
                        counseling sessions and webinars  Send email updates,
                        alerts, and newsletters  Process applications or form
                        submissions  Monitor and analyze usage trends for
                        platform improvement  Send you marketing and
                        promotional offers  Ensure compliance with legal
                        obligations
                      </p>
                      <p>
                        We also have the right to share your consented
                        information (such as reviews, feedback) that may enhance
                        our website’s image and credibility to our official
                        pages for marketing and other purposes.
                      </p>
                      <p className="font-bold">a. Information Retention</p>
                      <p>
                        We believe in purpose-based retention. Your student data
                        is only kept for as long as it is needed (4 years) to
                        fulfill the purposes it was collected for, after which
                        it will be securely deleted or anonymized, depending on
                        the usage and necessity value. The data will only be
                        accessible upon request to users if it is still in
                        storage or archive. We may also keep the data secured
                        after business has been concluded if retention is
                        necessary for any ongoing legal proceedings or to
                        protect your or our legal interests for any reason.
                      </p>
                      <p className="font-bold">
                        We collect the following types of information to provide
                        and improve our services:
                      </p>
                      <p className="font-bold">a. Personal Information</p>
                      <p>
                         Full name  Date of birth  Email address  Phone
                        number  Mailing address  Country of origin and
                        citizenship  Passport information (if and where
                        applicable)  Educational background (grades,
                        transcripts, standardized test scores)  Career
                        interests and preferences  Financial information (e.g.,
                        scholarship eligibility, bank details, card information,
                        etc.)  Uploaded documents (e.g., resumes, SOPs,
                        recommendation letters)
                      </p>
                      <p className="font-bold">
                        b. Technical & Usage Information
                      </p>
                      <p>
                         IP address  Browser type and version  Operating
                        system  Referral source  Geographical location 
                        Length of visit  Website navigation paths  Page views
                         Frequency and pattern of service use  Cookies and
                        similar tracking technologies (see Section 7) You may
                        use our website or app, both will access these
                        information bits that are necessary for profile
                        completion and tailored assessment result.
                      </p>
                      <p className="font-bold">
                        4. Data Sharing and Disclosure
                      </p>
                      <p>
                        We do not rent or sell your personal data. Data sharing
                        is only limited to the trusted partners and legal
                        authorities (under special circumstances). We may share
                        your data under the following circumstances:
                      </p>
                      <p>
                         With partner universities or institutions for
                        application processing or eligibility assessment. It
                        includes giving us consent to move forward with
                        applications and enrolment with higher studies
                        institutions on your behalf.  With third-party service
                        providers (e.g., payment processors, cloud hosting,
                        analytics tools) under strict data protection
                        agreements. It may include making travel arrangements,
                        applying for visa(s), and arranging accommodations or
                        opening new bank accounts.  With counselors assigned to
                        guide you, as per your consent.  When legally required
                        to comply with investigations, subpoenas, or court
                        orders.  In case of a merger or acquisition where user
                        data is part of the transferred assets.
                      </p>
                      <p>
                        Nevertheless, you should stay vigilant of the cyber
                        security threats that you may encounter for any reason.
                        We do our best to keep our site secure, but it is
                        possible for hackers or cybercriminals to get access to
                        your data. Proceed at your own risk and choose safe
                        connections to minimize potential threats.
                      </p>
                      <p className="font-bold">5. User Rights and Choices</p>
                      <p>
                        Your data and its presentation is based on your consent.
                        Depending on your location, you may have the following
                        rights regarding your shared information:
                      </p>
                      <p>
                        {" "}
                         Access – Request access to your personal information.
                         Correction – Request correction of inaccurate or
                        incomplete data.  Deletion – Request deletion of your
                        data.  Objection/Restriction – Object to processing or
                        request limitations placed on your personal data.
                      </p>
                      <p>
                        To exercise any of these rights, please contact us at
                        info@wwah.ai.
                      </p>
                      <p>
                        We will do our best to facilitate you in any of your
                        queries.
                      </p>
                      <p className="font-bild">6. Data Security</p>
                      <p>
                        We implement reasonable administrative, technical, and
                        physical safeguards to protect your data from
                        unauthorized access, loss, misuse, or alteration. These
                        include:
                      </p>
                      <p> SSL Encryption  Regular vulnerability scanning</p>
                      <p>
                        Still, we cannot guarantee accidental or intentional
                        misuse from unauthorized or harmful sources. We will
                        always try to take appropriate measures and actions to
                        keep your data secure from external threats.
                      </p>
                      <p className="font-bold">
                        6. International Data Transfers
                      </p>
                      <p>
                        If you are accessing the service from outside the
                        country where our servers are located, your information
                        may be transferred across borders. We ensure appropriate
                        safeguards in line with GDPR and other applicable laws.
                      </p>
                      <p className="font-bold">
                        7. Cookies and Tracking Technologies
                      </p>
                      <p>
                        We use cookies and similar technologies to customize
                        your overall website surfing experience. They are used
                        to:
                      </p>
                      <p>
                         Remember user preferences  Analyze usage patterns
                        Improve platform performance
                      </p>
                      <p>
                        They do not store or share your personal information.
                        Instead, they help us in suggesting you content,
                        courses, and universities based on your preferences,
                        recent searches etc. Collecting cookies also helps save
                        your log in details, allowing you to save time by not
                        entering username and password again and again. We may
                        use these cookies to advertise third-party products or
                        services according to your preferences. It can include,
                        but not be limited to, third party ad servers or network
                        advertisers.
                      </p>
                      <p>
                        You can modify the cookie settings through your browser
                        or privacy settings if you do not agree with any or all
                        information collection policies. It is to be noted here
                        that the website may not work or react strangely, making
                        it difficult for you to save or submit progress on
                        applications due to erasing cookies.
                      </p>
                      <p className="font-bold">8. Third-Party Links</p>
                      <p>
                        We support and endorse protection of privacy on this
                        website and internet in general. However, our platform
                        may contain links to external websites or partners whose
                        privacy policies may differ. We are not responsible for
                        the privacy practices or content of those third parties.
                        We are only responsible for using and distributing your
                        information for the listed (and consented) uses, but if
                        a third-party chooses to use your data, we will not be
                        consider liable for it. If you have any concerns, we
                        suggest and encourage you to go over their privacy
                        policies as well as terms and conditions to understand
                        the consequences before providing your personal or
                        sensitive information online.
                      </p>
                      <p className="font-bold">
                        9. Changes to This Privacy Policy
                      </p>
                      <p>
                        We may update this Privacy Policy from time to time. Any
                        changes will be posted with a revised “Last Updated”
                        date. Significant changes will be communicated via email
                        or in-platform notifications.
                      </p>
                      <p className="font-bold"> 10. Contact Us</p>
                      <p>
                        If you have any questions or concerns about this policy
                        or your personal data, please contact us at:
                      </p>
                      <p className="font-bold">
                        WWAH - World Wide Admissions Hub
                      </p>
                      <p>Email: info@wwah.ai</p>
                      <p className="font-bold">Official Address:</p>
                      <p>
                        Zaheer Hussain Al Waheda 30 A street, 12, Ground,
                        Villa12
                      </p>
                      <p className="font-bold">Phone Number</p>
                      <p>+971 58 251 4675</p>
                      <p>Privacy Policy Posted on 28/04/2025</p>
                    </div>
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
  open={accordionModal === "terms"}
  onOpenChange={(isOpen) =>
    setAccordionModal(isOpen ? "terms" : null)
  }
>
                      <DialogTrigger asChild>
                        <p
                          className="hover:underline cursor-pointer text-sm font-normal"
                          onClick={() => setAccordionModal("terms")}
                        >
                          Terms & Conditions
                        </p>
                      </DialogTrigger>
                      <DialogContent className="!rounded-2xl max-w-[300px] md:max-w-[500px] lg:max-w-none max-h-[55vh] md:max-h-[70vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Terms & Conditions</DialogTitle>
                        </DialogHeader>
                        {/* <p>These Terms and Conditions govern your use...</p> */}
                          <div className="">
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
  open={accordionModal === "privacy"}
  onOpenChange={(isOpen) =>
    setAccordionModal(isOpen ? "privacy" : null)
  }
>
                      <DialogTrigger asChild>
                        <p
                          className="hover:underline cursor-pointer text-sm font-normal"
                                onClick={() => setAccordionModal("privacy")}
                        >
                          Privacy Policy
                        </p>
                      </DialogTrigger>
                      <DialogContent className="!rounded-2xl max-w-[300px] md:max-w-[500px] lg:max-w-none max-h-[55vh] md:max-h-[70vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle >Privacy Policy</DialogTitle>
                        </DialogHeader>
                        {/* <p>We are committed to protecting your privacy...</p> */}
                            <div>
                      <p>
                        Welcome to WWAH (“we,” “our,” or “us”). Your privacy is
                        important to us. This Privacy Policy explains how we
                        collect, use, disclose, and safeguard your information
                        when you visit our AI-powered study abroad platform (the
                        “Service”), which provides personalized recommendations
                        for universities, courses, scholarships, and counseling
                        services.
                      </p>
                      <p>
                        By using our website, you consent to the privacy policy
                        terms mentioned ahead.
                      </p>
                      <p className="font-bold">
                        1. Why Do We Collect Information?
                      </p>
                      <p>
                        We collect your personal information to identify your
                        personal preferences and let our AI platform match you
                        up with different universities that have the highest
                        probability of accepting you into theirs program. It
                        helps us deliver better service to you, in accordance
                        with your needs and desires. Also, we may use it to keep
                        you updated of the developments in the field of
                        education or to inform of your latest news and events
                        that may be in your interests.
                      </p>
                      <p className="font-bold">
                        2. How Do We Use Your Information?
                      </p>
                      <p>We use your data to:</p>
                      <p>
                         Provide tailored university, course, and scholarship
                        matches using AI-based algorithms  Offer personalized
                        counseling recommendations  Facilitate virtual
                        counseling sessions and webinars  Send email updates,
                        alerts, and newsletters  Process applications or form
                        submissions  Monitor and analyze usage trends for
                        platform improvement  Send you marketing and
                        promotional offers  Ensure compliance with legal
                        obligations
                      </p>
                      <p>
                        We also have the right to share your consented
                        information (such as reviews, feedback) that may enhance
                        our website’s image and credibility to our official
                        pages for marketing and other purposes.
                      </p>
                      <p className="font-bold">a. Information Retention</p>
                      <p>
                        We believe in purpose-based retention. Your student data
                        is only kept for as long as it is needed (4 years) to
                        fulfill the purposes it was collected for, after which
                        it will be securely deleted or anonymized, depending on
                        the usage and necessity value. The data will only be
                        accessible upon request to users if it is still in
                        storage or archive. We may also keep the data secured
                        after business has been concluded if retention is
                        necessary for any ongoing legal proceedings or to
                        protect your or our legal interests for any reason.
                      </p>
                      <p className="font-bold">
                        We collect the following types of information to provide
                        and improve our services:
                      </p>
                      <p className="font-bold">a. Personal Information</p>
                      <p>
                         Full name  Date of birth  Email address  Phone
                        number  Mailing address  Country of origin and
                        citizenship  Passport information (if and where
                        applicable)  Educational background (grades,
                        transcripts, standardized test scores)  Career
                        interests and preferences  Financial information (e.g.,
                        scholarship eligibility, bank details, card information,
                        etc.)  Uploaded documents (e.g., resumes, SOPs,
                        recommendation letters)
                      </p>
                      <p className="font-bold">
                        b. Technical & Usage Information
                      </p>
                      <p>
                         IP address  Browser type and version  Operating
                        system  Referral source  Geographical location 
                        Length of visit  Website navigation paths  Page views
                         Frequency and pattern of service use  Cookies and
                        similar tracking technologies (see Section 7) You may
                        use our website or app, both will access these
                        information bits that are necessary for profile
                        completion and tailored assessment result.
                      </p>
                      <p className="font-bold">
                        4. Data Sharing and Disclosure
                      </p>
                      <p>
                        We do not rent or sell your personal data. Data sharing
                        is only limited to the trusted partners and legal
                        authorities (under special circumstances). We may share
                        your data under the following circumstances:
                      </p>
                      <p>
                         With partner universities or institutions for
                        application processing or eligibility assessment. It
                        includes giving us consent to move forward with
                        applications and enrolment with higher studies
                        institutions on your behalf.  With third-party service
                        providers (e.g., payment processors, cloud hosting,
                        analytics tools) under strict data protection
                        agreements. It may include making travel arrangements,
                        applying for visa(s), and arranging accommodations or
                        opening new bank accounts.  With counselors assigned to
                        guide you, as per your consent.  When legally required
                        to comply with investigations, subpoenas, or court
                        orders.  In case of a merger or acquisition where user
                        data is part of the transferred assets.
                      </p>
                      <p>
                        Nevertheless, you should stay vigilant of the cyber
                        security threats that you may encounter for any reason.
                        We do our best to keep our site secure, but it is
                        possible for hackers or cybercriminals to get access to
                        your data. Proceed at your own risk and choose safe
                        connections to minimize potential threats.
                      </p>
                      <p className="font-bold">5. User Rights and Choices</p>
                      <p>
                        Your data and its presentation is based on your consent.
                        Depending on your location, you may have the following
                        rights regarding your shared information:
                      </p>
                      <p>
                        {" "}
                         Access – Request access to your personal information.
                         Correction – Request correction of inaccurate or
                        incomplete data.  Deletion – Request deletion of your
                        data.  Objection/Restriction – Object to processing or
                        request limitations placed on your personal data.
                      </p>
                      <p>
                        To exercise any of these rights, please contact us at
                        info@wwah.ai.
                      </p>
                      <p>
                        We will do our best to facilitate you in any of your
                        queries.
                      </p>
                      <p className="font-bild">6. Data Security</p>
                      <p>
                        We implement reasonable administrative, technical, and
                        physical safeguards to protect your data from
                        unauthorized access, loss, misuse, or alteration. These
                        include:
                      </p>
                      <p> SSL Encryption  Regular vulnerability scanning</p>
                      <p>
                        Still, we cannot guarantee accidental or intentional
                        misuse from unauthorized or harmful sources. We will
                        always try to take appropriate measures and actions to
                        keep your data secure from external threats.
                      </p>
                      <p className="font-bold">
                        6. International Data Transfers
                      </p>
                      <p>
                        If you are accessing the service from outside the
                        country where our servers are located, your information
                        may be transferred across borders. We ensure appropriate
                        safeguards in line with GDPR and other applicable laws.
                      </p>
                      <p className="font-bold">
                        7. Cookies and Tracking Technologies
                      </p>
                      <p>
                        We use cookies and similar technologies to customize
                        your overall website surfing experience. They are used
                        to:
                      </p>
                      <p>
                         Remember user preferences  Analyze usage patterns
                        Improve platform performance
                      </p>
                      <p>
                        They do not store or share your personal information.
                        Instead, they help us in suggesting you content,
                        courses, and universities based on your preferences,
                        recent searches etc. Collecting cookies also helps save
                        your log in details, allowing you to save time by not
                        entering username and password again and again. We may
                        use these cookies to advertise third-party products or
                        services according to your preferences. It can include,
                        but not be limited to, third party ad servers or network
                        advertisers.
                      </p>
                      <p>
                        You can modify the cookie settings through your browser
                        or privacy settings if you do not agree with any or all
                        information collection policies. It is to be noted here
                        that the website may not work or react strangely, making
                        it difficult for you to save or submit progress on
                        applications due to erasing cookies.
                      </p>
                      <p className="font-bold">8. Third-Party Links</p>
                      <p>
                        We support and endorse protection of privacy on this
                        website and internet in general. However, our platform
                        may contain links to external websites or partners whose
                        privacy policies may differ. We are not responsible for
                        the privacy practices or content of those third parties.
                        We are only responsible for using and distributing your
                        information for the listed (and consented) uses, but if
                        a third-party chooses to use your data, we will not be
                        consider liable for it. If you have any concerns, we
                        suggest and encourage you to go over their privacy
                        policies as well as terms and conditions to understand
                        the consequences before providing your personal or
                        sensitive information online.
                      </p>
                      <p className="font-bold">
                        9. Changes to This Privacy Policy
                      </p>
                      <p>
                        We may update this Privacy Policy from time to time. Any
                        changes will be posted with a revised “Last Updated”
                        date. Significant changes will be communicated via email
                        or in-platform notifications.
                      </p>
                      <p className="font-bold"> 10. Contact Us</p>
                      <p>
                        If you have any questions or concerns about this policy
                        or your personal data, please contact us at:
                      </p>
                      <p className="font-bold">
                        WWAH - World Wide Admissions Hub
                      </p>
                      <p>Email: info@wwah.ai</p>
                      <p className="font-bold">Official Address:</p>
                      <p>
                        Zaheer Hussain Al Waheda 30 A street, 12, Ground,
                        Villa12
                      </p>
                      <p className="font-bold">Phone Number</p>
                      <p>+971 58 251 4675</p>
                      <p>Privacy Policy Posted on 28/04/2025</p>
                    </div>
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
                  href="/scholarships"
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
                  WWAH Counselling Session
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
                      WWAH Online Counselling Session
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
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 mt-3 md:mt-5 space-y-4 sm:space-y-0">
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
