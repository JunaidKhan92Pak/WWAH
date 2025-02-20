import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

function GlobalCollab() {
  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center h-auto lg:h-[435px] 2xl:[520px] w-full mx-auto my-4 bg-black text-white">
      <div className="w-[90%] px-4 sm:px-6 lg:px-8 lg:w-1/2">
        <div className="text-left pl-0 lg:pl-16">
          <h5 className="my-4 w-full lg:w-[90%]">
            Transforming Education Through Global Collaboration
          </h5>
          <p className="mb-4 w-full xl:w-[90%] 2xl:w-3/4">
            Over the years, we have empowered educational agents globally,
            helping them grow their businesses while connecting students from
            around the world. Become a part of our international network and
            grow your business while helping students achieve their dreams.
          </p>
          <Link href="#">
            <Button variant="destructive" size="sm">
              Become a Partner!
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-[90%] lg:w-1/2 flex items-center justify-end mt-6 lg:mt-0">
        <Image
          src="/partnerUs/Mask-pink.svg"
          alt="Partner With Us"
          className="w-full lg:max-w-2xl object-contain h-[180px] sm:h-[300px] lg:h-[500px]"
          width={950}
          height={1100}
        />
      </div>
    </div>
  );
}

export default GlobalCollab;
