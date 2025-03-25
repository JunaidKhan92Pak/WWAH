import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-white px-4">
      <div className="bg-white text-white p-10 rounded-xl shadow-xl text-center max-w-lg border border-gray-200">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">404</h2>
        <h3 className="text-2xl text-gray-900 font-semibold mb-3">
          Page Not Found
        </h3>
        <p className="text-lg text-gray-400 mb-6">
          The page you&#39;re looking for might have been removed or is temporarily
          unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2 bg-red-700 text-white font-medium rounded-lg shadow-md hover:bg-gold-600 transition-all duration-300"
        >
          <FaArrowLeft className="text-lg" /> Return Home
        </Link>
      </div>
    </div>
  );
}
