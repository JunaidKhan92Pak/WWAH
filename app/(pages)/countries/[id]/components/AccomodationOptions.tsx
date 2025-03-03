"use client";
import Image from "next/legacy/image";
import { Button } from '@/components/ui/button';
import Link from "next/link";

interface Accomodation {
  accomodation: { name: string; detail: string }[];
}

const AccomodationOptions = ({ accomodation }: Accomodation) => {
  const arr2 = [
    {
      src: "/countrypage/uniAccomodation.jpg",
      alt: "Private Accommodation",
      heading: "University/College-Managed Accommodation",
      p: "Private student accommodation providers offer purpose-built housing with modern amenities, specifically for students. These can be a bit more expensive than university-managed accommodation but often come with additional features like gyms, social spaces, and organized events.",
    },

    {
      src: "/countrypage/privateAcc.jpg",
      alt: "Private Accommodation",
      heading: "Private Student Accommodation",
      p: "For students who prefer independent living, renting a private flat or house is a popular option, especially for those in their second or third year. You can rent alone or share with friends or other students.",
    },
    {
      src: "/countrypage/Privaterentals.JPG",
      alt: "Private Accommodation",
      heading: "Private Rentals (Flats and Houses)",
      p: "For students who prefer independent living, renting a private flat or house is a popular option, especially for those in their second or third year. You can rent alone or share with friend or other students",
    },
    {
      src: "/countrypage/Homestay.JPEG",
      alt: "Private Accommodation",
      heading: "Homestay",
      p: "Living with a local UK family is another accommodation option for international students. This provides a cultural immersion experience and a more familyoriented living arrangement.",
    },
    {
      src: "/countrypage/shortterm.JPEG",
      alt: "Private Accommodation",
      heading: "Short-Term Accommodation",
      p: "For students who need temporary accommodation (e.g., for a short course, study abroad, or before securing permanent housing), there are options like Hostels and Hotels.",
    },
  ];
  const name = accomodation?.map((acc) => acc.name);
  const description = accomodation?.map((acc) => acc.detail);

  return (
    <>
      <div>
        <div className="md:my-10 my-5 2xl:my-20">
          <h3 className="text-center">Accommodation Options!</h3>
          <div
            className="flex overflow-x-auto space-x-4 p-4 "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {arr2.map((image, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 max-w-[200px] md:max-w-[400px] 2xl:max-w-[600px]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="rounded-xl shadow-lg md:h-[250px] h-[150px] w-[200px] md:w-[350px]"
                />

                {/* Text Overlay for Larger Screens */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-100 rounded-xl hidden sm:flex flex-col justify-end p-4">
                  <p className="text-white text-lg font-bold">
                    {name ? name[index] : <></>}
                  </p>
                  <p className="text-white text-sm leading-4">
                    {description ? description[index] : <></>}
                  </p>
                </div>

                {/* Text Below the Image for Smaller Screens */}
                <div className="sm:hidden mt-2">
                  <p className="text-[14px] font-bold">
                    {name ? name[index] : <></>}
                  </p>
                  <p className="text-[13px] leading-4">
                    {description ? description[index] : <></>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisor Section */}
        <section
          className="relative text-white bg-[#FCE7D2]"
          style={{
            backgroundImage: "url('/bg-usa.png')",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-[#FCE7D2] opacity-70 z-0"></div>
          <div className="flex flex-col md:flex-row w-full py-6 md:px-12 lg:gap-10 gap-5 sm:gap-0 mb-10">
            <div className="relative w-full md:w-1/2">
              <h4 className="md:w-full text-gray-900 leading-6 text-center lg:text-left">
                Need help finding the perfect place to live abroad? Ask the WWAH
                Advisor now!
              </h4>
            </div>
            <div className="relative w-full md:w-1/2 flex justify-center items-center md:justify-end">
              <Link href="/contactus">
                <Button className="bg-red-700 2xl:w-100 2xl:h-35 2xl:py-10 2xl:text-[30px]">
                  Consult with WWAH Advisor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AccomodationOptions;
