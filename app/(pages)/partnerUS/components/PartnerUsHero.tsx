import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PartnerUsHero() {
  return (
    <section className="mx-auto w-[90%] md:w-[95%] overflow-hidden mt-4">
      <div
        className="relative min-h-[250px] sm:min-h-[400px] flex flex-col justify-center items-center md:items-start text-white bg-cover bg-center rounded-3xl py-4 sm:p-0"
        style={{
          backgroundImage: ` url(${"./partnerWithUs.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full px-4 sm:px-6 md:px-12">
          <div className="text-white text-left md:w-[90%]">
            <h1 className="mb-0 sm:mb-2 w-[100%] lg:w-[50%]">
              Partner with Us!
            </h1>
            <p className="mb-2 md:mb-4 w-[100%] xl:w-[50%] 2xl:w-3/4 leading-snug sm:leading-relaxed text-sm md:text-base">
              At WWAH, we believe in building strong, strategic partnerships to
              expand access to world-class education for students around the
              globe. By partnering with us, you join a global network of
              esteemed educational institutions, recruitment agencies, and
              service providers, all working together to guide and support
              students in their academic journey.
            </p>
            <Link target="blank" href="#">
              <Button variant="destructive" size="sm">
                Become a Partner!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnerUsHero;
