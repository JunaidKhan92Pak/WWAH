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
    <div>
      <div className="relative text-white py-4 sm:py-8 md:px-10 px-4 mt-4 md:mt-10 w-full">
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

        <Carousel>
          <CarouselContent>
            {carouselData.map((data, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col gap-4 lg:flex-row  justify-between items-center w-[89%] md:w-[75%] lg:w-[90%] xl:w-[80%] mx-auto">
                  {/* Left Side: Text */}
                  <div className="w-full">
                    <h4 className="leading-tight">Campus Life at {uniname}</h4>
                    <h5 className="text-[#F6B677]">{data.title}</h5>
                    <p className="text-justify md:text-start lg:leading-tight xl:leading-6 text-[#9D9D9D]">{data.description}</p>
                  </div>

                  {/* Right Side: Image */}
                  <div className="w-full">
                    <Card>
                      <CardContent>
                        <div className="relative w-full lg:w-[97%] h-[220px]  md:h-[360px] lg:h-[310px] xl:h-[350px] 2xl:h-[450px]">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-black" />
          <CarouselNext className="text-black" />
        </Carousel>
      </div>
    </div>
  );
};

export default GalwayCampuslife;
