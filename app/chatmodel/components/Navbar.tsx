import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { useUserStore } from "@/store/userStore";
import { useEffect } from 'react';
import Loading from '@/app/loading';

export const Navbar = () => {
  const { isAuthenticate, user, fetchUser, loading } = useUserStore();
  useEffect(() => {
    fetchUser(); // Fetch user data when the component mounts
  }, []);
  if (loading) {
    return <Loading />;
  }

  return (
    <header className="fixed top-0 w-full bg-white border-b z-10">
      <div className="w-[90%] mx-auto sm:px-4 py-2 flex items-center">
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image
              src="/icons/zeusrobo.svg"
              alt="zeus"
              width={40}
              height={20}
            />
            <h4>Zeus by WWAH</h4>
          </div>
        </Link>
        <div className="ml-auto flex gap-2 items-center">
          {isAuthenticate ? (
            <>
              <h6>Hello, {user?.firstName || "Newbie"}!</h6>

              <FaUser className="text-gray-800  w-8 h-8 text-xl p-1 border border-gray-400 rounded-full" />
            </>
          ) : (
            <Link href="/signin">
              {" "}
              <Button className=" text-white border-[#F0851D] rounded-xl bg-red-700">
                Log In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
