import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Ensure the correct path

// Simple Card and CardContent components
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg overflow-hidden">{children}</div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="">{children}</div>
);

interface GalwayCampuslifeProps {
  data: {
    sports_recreation: string;
    accommodation: string;
    transportation: string;
    student_services: string;
    cultural_diversity: string;
    alumni_network_support: string;
  };
  uniname: string;
  images: {
    campus_sports_recreation?: string;
    campus_accommodation?: string;
    campus_transportation?: string;
    campus_student_services?: string;
    campus_cultural_diversity?: string;
    campus_alumni_network?: string;
  };
}

const GalwayCampuslife = ({ data, uniname, images }: GalwayCampuslifeProps) => {
  // Array for carousel data: image, title, and description for each slide
  const carouselData = [
    {
      image: `${images?.campus_sports_recreation
        ? images.campus_sports_recreation
        : "/banner.png"
        }`, // Image for the first slide
      title: "Sports & Recreation",
      description: `${data.sports_recreation}`,
    },
    {
      image: `${images?.campus_accommodation
        ? images.campus_accommodation
        : "/banner.png"
        }`, // Image for the second slide
      title: "Accommodation",
      description: `${data.accommodation}`,
    },
    {
      image: `${images?.campus_transportation
        ? images.campus_transportation
        : "/banner.png"
        }`, // Image for the third slide
      title: "Transportation",
      description: `${data.transportation}`,
    },
    {
      image: `${images?.campus_student_services
        ? images.campus_student_services
        : "/banner.png"
        }`, // Image for the third slide
      title: "Student Services",
      description: `${data.student_services}`,
    },
    {
      image: `${images?.campus_cultural_diversity
        ? images.campus_cultural_diversity
        : "/banner.png"
        }`, // Image for the third slide
      title: "Cultural Diversity",
      description: `${data.cultural_diversity}`,
    },
    {
      image: `${images?.campus_alumni_network
        ? images.campus_alumni_network
        : "/banner.png"
        }`, // Image for the third slide
      title: "Alumni Network & Support",
      description: `${data.alumni_network_support}`,
    },
  ];

  return (
    <div className="relative text-white  md:px-8  mt-8 ">

      {/* Background Image */}
      <div className="absolute inset-0 -z-10 bg-black">
        <Image
          src="/background.png" // Replace with your actual image path
          alt="Background Image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black opacity-80"></div>
      </div>

      {/* Content Section */}

      <Carousel className="relative w-full"
      >
        <CarouselContent>
          {carouselData.map((data, index) => (
            <CarouselItem key={index}>
              <div className="flex justify-center items-center h-full min-h-[400px] md:py-6"> {/* ensures full height */}
                {/* Left Side: Text */}
                <div className="flex flex-col gap-4 md:gap-6 lg:flex-row w-[70%] md:w-[70%] lg:w-[90%] xl:w-[80%] mx-auto py-6 lg:py-0 justify-between items-center">
                  <div className="w-full">
                    <h5 className="leading-tight">Campus Life at {uniname}</h5>
                    <h6 className="text-[#F6B677] my-1">{data.title}</h6>
                    {/* <p className="text-justify md:text-start lg:leading-tight xl:leading-6 text-[#9D9D9D]"> */}
                    <p
                          className="text-gray-300 md:leading-relaxed text-justify md:text-start h-44 overflow-hidden overflow-y-auto scrollbar-hide"
                          style={{
                            scrollbarWidth: "thin",
                            msOverflowStyle: "none",
                                        scrollbarColor: '#888 transparent', 

                          }}
                        >
                      {data.description}</p>
                  </div>

                  {/* Right Side: Image */}
                  <div className="w-full">
                    <Card>
                      <CardContent>
                        <div className="relative w-full lg:w-[97%] h-[200px] md:h-[270px] lg:h-[300px]">
                          <Image
                            src={data?.image ? data.image : "/placeholder.jpg"} // Replace with your actual image path
                            alt={`Campus View ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-3xl"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-black" />
        <CarouselNext className="text-black" />
      </Carousel>
    </div>
  );
};

export default GalwayCampuslife;