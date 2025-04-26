import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen blur-lg bg-gray-300">
        {/* Sign-in Form Section */}
        <div className="flex-1 max-w-2xl sm:pl-44 px-20 sm:pr-28">
          <Link href="/">
            <Image
              src="/logowwah.svg"
              alt="WWAH Logo"
              width={150}
              height={60}
            />{" "}
          </Link>
          <div className="mb-2 text-center">Reset Password</div>
          <p className="text-gray-600 text-center sm:px-10 mb-6">
            Please enter your new password to secure your account.
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-lg mb-5"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-700 text-white p-2 rounded-lg"
            >
              Reset my password
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center my-2">
            <Image
              src="/Group.png"
              width={400}
              height={400}
              alt="Decorative"
              className="object-contain h-auto"
            />
          </div>
        </div>
      </div>
      <div className="bg-white absolute inset-0 max-w-sm h-40 m-auto rounded-2xl">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-5">
            <div className="pt-5">Password Reset</div>
            <div className="text-center">Successful!</div>
          </div>
          <Link target="blank" href="/signin">
            <button
              type="submit"
              className="bg-red-700 w-72 text-white p-2 rounded-lg"
            >
              Go back
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
