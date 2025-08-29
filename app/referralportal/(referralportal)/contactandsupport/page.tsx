// app/page.js
"use client";
import Image from "next/image";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    message: "",
  });
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false); // modal state

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fixed: Ensure the URL is correctly formatted
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}refcontact`;
      console.log("Making request to:", apiUrl); // Debug log

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // success → show modal + reset
      setSubmitted(true);
      setOpen(true);
      setFormData({ name: "", email: "", contactNo: "", message: "" });
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to send message. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ reset button when modal closes
  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSubmitted(false); // reset submit button text
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* FAQ Header */}
      <section
        className="border rounded-xl shadow-md text-white p-4 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/refferalportal/contactandsupport/backgroundimg.svg')", // path from public folder
        }}
      >
        <div className="text-center">
          <h4>Frequently Asked Questions</h4>
          <p className="text-2xl">(FAQ&apos;s)</p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <div className="border rounded-xl shadow-md p-4">
        <div>
          <Accordion
            type="single"
            collapsible
            className="grid md:grid-cols-2 gap-4"
          >
            {/* Default FAQs */}
            <AccordionItem value="item-1" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3">
                What is the Mini Brand Ambassador (MBA) program?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-600">
                The MBA program lets selected students represent WWAH, promote
                it through referrals, and earn exciting rewards.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3">
                Where can I find my referral link or QR code?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-600">
                Go to the &quot;Share & Earn&quot; section on your dashboard to
                copy your link or download your QR code.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3">
                How does the referral system work?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-600">
                You share your referral link and every time someone registers
                through it, you start earning rewards.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3">
                How can I track my referrals and commissions?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-600">
                All tracking is available in the &ldquo;My
                Referrals&ldquo; section of your dashboard.
              </AccordionContent>
            </AccordionItem>

            {/* Extra FAQs (show only if showMore is true) */}
            {showMore && (
              <>
                <AccordionItem value="item-5" className="border rounded-lg">
                  <AccordionTrigger className="px-4 py-3">
                    Who can join the MBA program?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-600">
                    Any student currently registered with WWAH can apply to
                    become a Mini Brand Ambassador.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border rounded-lg">
                  <AccordionTrigger className="px-4 py-3">
                    Is there a limit to how many referrals I can make?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-600">
                    No, there is no limit — the more referrals you bring, the
                    more rewards you can earn.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border rounded-lg">
                  <AccordionTrigger className="px-4 py-3">
                    How are rewards given out?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-600">
                    Rewards are credited to your account after verification of
                    successful referrals.
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>

          {/* View More / View Less Button */}
          <div className="text-center mt-4">
            <Button
              onClick={() => setShowMore(!showMore)}
              className="bg-red-600 text-white px-6 py-1.5 rounded-lg"
            >
              {showMore ? "View Less" : "View More"}
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="border rounded-xl shadow-md p-4 bg-gradient-to-b from-[#FFFFFE] to-[#FDEEDF]">
        <h3 className="text-center">Contact Us</h3>
        <div className="flex gap-10 flex-col md:flex-row p-4">
          {/* Left Side */}
          <div className="w-full md:w-[35%]">
            <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
            <div className="mb-6 flex items-start text-gray-700">
              <Image
                src="/refferalportal/contactandsupport/email.svg"
                alt="Email icon"
                width={20}
                height={20}
                className="mr-2"
              />
              <div className="">
                <p className="font-bold mr-2">Email</p>
                <span>support@wwah.ai</span>
              </div>
            </div>

            <div className="mb-6 flex items-start text-gray-700">
              <Image
                src="/refferalportal/contactandsupport/whatsapp.svg"
                alt="WhatsApp"
                width={18}
                height={18}
                className="mr-2"
              />
              <div className="">
                <p className="font-bold">WhatsApp</p>
                <span>+92 323 044 5345</span>
              </div>
            </div>

            <div className="mt-6">
              <Image
                src="/refferalportal/contactandsupport/contact.svg"
                alt="Contact Icon"
                width={64} // 16 * 4 = 64px
                height={64}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-[60%]">
            <h2 className="text-2xl font-bold mb-6">Contact Form</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2 w-full placeholder:text-sm"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2 w-full placeholder:text-sm"
                  required
                />
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Contact No."
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2 w-full placeholder:text-sm"
                />
              </div>
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full placeholder:text-sm"
                required
              ></textarea>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 text-white px-6 py-1.5 rounded-lg"
                >
                  {loading
                    ? "Submitting..."
                    : submitted
                    ? "Submitted"
                    : "Submit"}
                </Button>
              </div>
            </form>

            {/* Success Modal */}
            <Dialog open={open} onOpenChange={handleModalChange}>
              <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
                <Image
                  src="/DashboardPage/success.svg"
                  alt="Success"
                  width={150}
                  height={150}
                />
                <DialogHeader>
                  <DialogTitle className="font normal text-center">
                    Contact form submitted successfully!
                  </DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
}
