import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PartnerUsHero() {
  return (
    <div
      className="relative flex items-center justify-center h-[270px] lg:h-[450px] w-[90%] mx-auto my-4 rounded-2xl"
      style={{
        backgroundImage: ` url(${"./partnerWithUs.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-white text-left w-[90%]">
          <h1 className="mb-0 sm:mb-4 w-[100%] lg:w-[50%]">Partner with Us!</h1>
          <p className="mb-0 sm:mb-4 w-[100%] xl:w-[50%] 2xl:w-3/4 leading-snug sm:leading-relaxed">
            At WWAH, we believe in building strong, strategic partnerships to
            expand access to world-class education for students around the
            globe. By partnering with us, you join a global network of esteemed
            educational institutions, recruitment agencies, and service
            providers, all working together to guide and support students in
            their academic journey.
          </p>
          <Link href="#">
            <Button variant="destructive" size="sm">
              Become a Partner!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PartnerUsHero;
