"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-white px-4">
      <div className="flex flex-col items-center justify-center bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg border border-r-gray-300">
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-3xl text-gray-900 font-bold mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-lg text-gray-400 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-red-600 text-white rounded-lg text-lg font-medium shadow-md hover:bg-red-700 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
