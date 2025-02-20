import React from "react";
import Image from "next/image";

interface SliderItem {
  icon: string;
  p1: string;
  caption: string;
}

interface ImageSliderProps {
  data: SliderItem[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ data }) => {
  return (
    <section className="w-[90%] mx-auto">
      <div
        className="flex overflow-x-auto space-x-4 p-4 hide-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 justify-center rounded-lg"
          >
            <Image
              src={item.icon}
              alt={`Slide ${index + 1}`}
              width={0}
              height={0}
              sizes="(max-width: 768px) 40vw, (max-width: 2560px) 100vw, 100vw"
              className="rounded-xl w-[80vw] h-[50vh] md:w-[50vw] md:h-[30vw] lg:w-[35vw] lg:h-[25vw] xl:w-[30vw] xl:h-[20vw]"
            />
         
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageSlider;
