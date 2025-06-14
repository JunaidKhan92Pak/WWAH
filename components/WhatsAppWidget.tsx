"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io";
import { GraduationCap, FileText, DollarSign } from "lucide-react";

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const contacts = [
    {
      name: "Student Advisor",
      phone: "923120762039",
      message: "Hello! I'm interested in your services.",
      description: "Get guidance on study plans and course selection",
      icon: GraduationCap,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      name: "Admission Officer",
      phone: "923120762040",
      message: "Hi! I need help with the admission process.",
      description: "Get assistance with applications and enrollment",
      icon: FileText,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      name: "Scholarship Counselor",
      phone: "923120762041",
      message: "Hello! I have a question about scholarships.",
      description: "Get help finding and applying for scholarships",
      icon: DollarSign,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoLogoWhatsapp size={24} />
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-80 absolute bottom-16 right-0 transition-all duration-300 ease-out border">
          {/* Close Button */}
          <div className="flex justify-end mb-2">
            <button onClick={() => setIsOpen(false)}>
              <X size={20} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-4">
            <div className="bg-red-700 p-3 rounded-full w-12 h-12 mx-auto mb-2">
              <IoLogoWhatsapp className="text-white mx-auto" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Welcome to Live Chat
            </h3>
            <p className="text-sm text-gray-500">
              Our professional support team is always ready to help you with
              your queries.
            </p>
          </div>

          {/* Contacts Row */}
          <div className="flex justify-between items-center mb-4">
            {contacts.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <a
                  key={index}
                  href={`https://wa.me/${
                    contact.phone
                  }?text=${encodeURIComponent(contact.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center group hover:scale-105 transition"
                >
                  <div
                    className={`rounded-full border-2 p-2 bg-white shadow ${contact.iconColor}`}
                  >
                    <IconComponent size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 mt-1 text-center">
                    {contact.name.split(" ")[0]}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center my-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 px-2">⏳</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Name Input */}
          <input
            type="text"
            placeholder="Type your name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-sm"
          />
x 
          {/* Start Chatting Button */}
          <button
            className="bg-red-700 text-white w-full py-2 rounded-full font-semibold hover:bg-orange-600 transition"
            onClick={() => {
              if (name.trim()) {
                window.open(
                  `https://wa.me/${contacts[0].phone}?text=Hi, I'm ${name}`,
                  "_blank"
                );
              }
            }}
          >
            Start Chatting
          </button>
        </div>
      )}
    </div>
  );
};

export default WhatsAppWidget;
