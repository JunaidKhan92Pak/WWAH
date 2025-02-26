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
  // Memoize the slides to prevent unnecessary re-renders
  const slides = React.useMemo(
    () => [
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

  // Track the current slide and image index within that slide
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [currentImages, setCurrentImages] = React.useState(0);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setCurrentImages(0); // Reset image index when slide changes
  };

  // Automatically change images within each slide every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages((prevIndex) => (prevIndex + 1) % slides[currentSlide].images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentSlide, slides]);

  return (
    <div className="py-8">
      <div className="relative text-white py-4 md:py-14 lg:py-20 px-5 md:px-12">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={slides[currentSlide].background}
            alt="Background Image"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        {/* Carousel Section */}
        <div className="px-2 sm:px-12">
          <Carousel
            className="relative w-full"
            onChange={(e: React.FormEvent<HTMLDivElement>) => {
              // Assuming the Carousel component sets a data attribute 'data-index'
              const indexStr = (e.target as HTMLElement).getAttribute("data-index");
              if (indexStr) {
                handleSlideChange(Number(indexStr));
              }
            }}
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col lg:flex-row justify-center gap-8 items-center">
                    {/* Image Section */}
                    <div className="w-[95%] sm:w-[80%] lg:w-[25%] 2xl:w-[25%]">
                      <div className="rounded-3xl overflow-hidden shadow-lg">
                        <Image
                          src={slide.images[currentImages] ?? "/placeholder.jpg"}
                          alt={slide.title}
                          width={400}
                          height={300}
                          className="object-cover w-full h-[180px] sm:h-[50vh] md:h-[60vh] lg:h-[40vh] xl:h-[40vh] 2xl:h-[55vh]"
                        />
                      </div>
                    </div>
                    {/* Text Section */}
                    <div className="w-full sm:w-[80%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[40%] space-y-4">
                      <h3>{slide.title}</h3>
                      {slide.isList ? (
                        <ul className="text-gray-300 leading-relaxed list-disc pl-5">
                          {slide.description
                            .split(" • ")
                            .map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-gray-300 leading-relaxed">
                          {slide.description}
                        </p>
                      )}
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
    </div>
  );
});
AboutGalway.displayName = "AboutGalway";
export default AboutGalway;
