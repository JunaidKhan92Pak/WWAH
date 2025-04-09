"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io";
const WhatsAppWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const phoneNumber = "923120762039"; // Replace with your WhatsApp number
    const message = encodeURIComponent("Hello! I'm interested in your services.");

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Button */}
            <button
                className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
                onClick={() => setIsOpen(!isOpen)}
            >
                <IoLogoWhatsapp size={24} />
            </button>

            {/* Chat Box */}
            {isOpen && (
                <div className="bg-white shadow-lg rounded-lg p-4 w-72 absolute bottom-16 right-0 animate-slideIn">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Chat with Us
                        </h3>
                        <button onClick={() => setIsOpen(false)}>
                            <X size={20} className="text-gray-500 hover:text-gray-700" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600">
                        Hi there! Need help? Click below to chat on WhatsApp.
                    </p>
                    <a
                        href={`https://wa.me/${phoneNumber}?text=${message}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600 transition"
                    >
                        Chat Now
                    </a>
                </div>
            )}
        </div>
    );
};

export default WhatsAppWidget;
