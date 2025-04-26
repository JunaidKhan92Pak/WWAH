import Image from "next/image";
import { Button } from "../button";
import Link from "next/link";

interface BannerProps {
  title: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

export default function Banner({
  title,
  buttonText,
  buttonLink,
  backgroundImage,
}: BannerProps) {
  return (
    <section className="relative w-full h-auto mt-6 flex items-center justify-center px-4 sm:px-8 md:px-12">
      <div className="flex w-full items-center justify-center">
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Image
            src={backgroundImage}
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 z-0 bg-[#FCE7D2]"
          />
        </div>
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-80 z-0"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full gap-4 sm:flex-row sm:justify-between  my-4 sm:my-6 leading-tight  ">
          {/* Left Side - Text */}
          <div className="w-full text-center sm:text-left sm:w-[65%] lg:w-[50%]">
            <h6 className="font-semibold">{title}</h6>
          </div>

          <div className="w-full flex justify-center sm:w-auto sm:justify-center">
            <Link href={buttonLink}>
              <Button className="px-3 sm:px-8 lg:px-8 py-3 sm:py-4 text-white bg-[#C7161E] rounded-lg shadow-lg hover:bg-[#A10E17] transition">
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
