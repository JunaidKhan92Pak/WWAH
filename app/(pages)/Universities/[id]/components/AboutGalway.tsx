"use client";
import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AboutGalwayProps {
  city: {
    historical_places: string;
    food_and_cafe: string;
    famous_places_to_visit: string[];
    cultures: string;
    transportation: string;
  };
  images: {
    city_historical_places_1: string;
    city_historical_places_2: string;
    city_historical_places_3: string;
    city_food_and_cafe_1: string;
    city_food_and_cafe_2: string;
    city_food_and_cafe_3: string;
    city_famous_places_1: string;
    city_famous_places_2: string;
    city_famous_places_3: string;
    city_cultures_1: string;
    city_cultures_2: string;
    city_cultures_3: string;
    city_transportation_1: string;
    city_transportation_2: string;
    city_transportation_3: string;
  };
}

const AboutGalway = React.memo(({ city, images }: AboutGalwayProps) => {
  const slides = React.useMemo(
    () => [
      {
        background: "/Aboutbackground.jpg",
        title: "ABOUT CITY",
        isIntro: true,
      },
      {
        images: [
          images?.city_historical_places_1,
          images?.city_historical_places_2,
          images?.city_historical_places_3,
        ],
        background: "/Aboutbackground.jpg",
        title: "History and Heritage",
        description: city.historical_places,
      },
      {
        images: [
          images?.city_food_and_cafe_1,
          images?.city_food_and_cafe_2,
          images?.city_food_and_cafe_3,
        ],
        background: "/Coffeewerk + Press.jpg",
        title: "Food and Cafe",
        description: city.food_and_cafe,
      },
      {
        images: [
          images?.city_famous_places_1,
          images?.city_famous_places_2,
          images?.city_famous_places_3,
        ],
        background: "/Galway Cathedral.jpg",
        title: "Famous Places to Visit",
        description: city.famous_places_to_visit.join(" • "),
        isList: true,
      },
      {
        images: [
          images?.city_cultures_1,
          images?.city_cultures_2,
          images?.city_cultures_3,
        ],
        background: "/Galway Jazz Festival.webp",
        title: "Cultures",
        description: city.cultures,
      },
      {
        images: [
          images?.city_transportation_1,
          images?.city_transportation_2,
          images?.city_transportation_3,
        ],
        background: "/Galway Jazz Festival.webp",
        title: "Transportation",
        description: city.transportation,
      },
    ],
    [city, images]
  );

  const [currentSlide, setCurrentSlide] = React.useState(1);
  const [currentImages, setCurrentImages] = React.useState(0);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setCurrentImages(0); // Reset image index when slide changes
  };

  React.useEffect(() => {
    const slideImages = slides[currentSlide]?.images || [];
    if (slideImages.length === 0) return; // Avoid running the interval if there are no images

    // Set interval to cycle through images of the current slide
    const interval = setInterval(() => {
      setCurrentImages((prevIndex) => (prevIndex + 1) % slideImages.length);
    }, 3000); // 3 seconds per image change

    return () => clearInterval(interval); // Cleanup interval on slide change or unmount
  }, [currentSlide, slides]); // Trigger effect whenever currentSlide changes

  return (
    <div className="relative text-white  md:px-12  mt-8 ">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={slides[currentSlide].background}
          alt="Background Image"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      {/* Carousel Section */}
      <Carousel
        className="relative w-full"
        onChange={(e: React.FormEvent<HTMLDivElement>) => {
          const indexStr = (e.target as HTMLElement).getAttribute("data-index");
          if (indexStr) {
            handleSlideChange(Number(indexStr));
          }
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
 <div className="flex justify-center items-center h-full min-h-[350px] py-6 md:py-8">
 {" "}
                {slide.isIntro ? (
                  // Intro Slide: "ABOUT CITY"
                  <div className="items-center justify-center text-center w-full">
                    <h2 className="text-white text-4xl md:text-[86px] tracking-wider font-bold">
                      {slide.title}
                    </h2>
                  </div>
                ) : (
                  // Regular Slide
                  <div className="flex flex-col md:flex-row  gap-4 md:gap-6 lg:flex-row justify-between items-center w-[70%] md:w-[60%] lg:w-[75%] xl:w-[60%]">
                    {/* Image Section */}
                    <div className="w-full">
                      <div className="rounded-3xl overflow-hidden shadow-lg w-full">
                        <Image
                          src={slide.images?.[currentImages] ?? "/placeholder.jpg"}
                          alt={slide.title}
                          width={400}
                          height={300}
                          className="object-cover w-full h-[150px] md:h-[250px] lg:h-[270px]"
                        />
                      </div>
                    </div>
                    {/* Text Section */}
                    <div className="w-[90%] xl:w-full">
                      <h4>{slide.title}</h4>
                      {slide.isList ? (
                        <ul className="text-gray-300 list-disc pl-0 lg:pl-5">
                          {slide.description
                            .split(" • ")
                            .map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                        </ul>
                      ) : (
                        <p
                          className="text-gray-300 leading-relaxed text-justify md:text-start h-44 overflow-hidden overflow-y-auto scrollbar-hide"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {slide.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="text-black" />
        <CarouselNext className="text-black" />
      </Carousel>
    </div>
  );
});

AboutGalway.displayName = "AboutGalway";
export default AboutGalway;
