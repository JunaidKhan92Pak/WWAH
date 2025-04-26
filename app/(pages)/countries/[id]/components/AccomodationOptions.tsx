"use client";
import Image from "next/legacy/image";
import Banner from "@/components/ui/enrollment/Banner";

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
      src: "/countrypage/Privaterentals.jpg",
      alt: "Private Accommodation",
      heading: "Private Rentals (Flats and Houses)",
      p: "For students who prefer independent living, renting a private flat or house is a popular option, especially for those in their second or third year. You can rent alone or share with friend or other students",
    },
    {
      src: "/countrypage/Homestay.jpeg",
      alt: "Private Accommodation",
      heading: "Homestay",
      p: "Living with a local UK family is another accommodation option for international students. This provides a cultural immersion experience and a more familyoriented living arrangement.",
    },
    {
      src: "/countrypage/shortterm.jpeg",
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
        <div className="md:my-10 my-5  mx-2">
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
                className="relative flex-shrink-0 max-w-[200px] md:max-w-[400px]"
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
        <div className="my-2 md:my-6">
          <Banner
            title="Need help finding the perfect place to live abroad? Ask the WWAH Advisor now!"
            buttonText="Consult with WWAH Advisor"
            buttonLink="/contactus"
            backgroundImage="/bg-usa.png"
          />
        </div>
      </div>
    </>
  );
};

export default AccomodationOptions;
