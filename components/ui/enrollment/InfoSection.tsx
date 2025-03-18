import Image from "next/image";

export interface InfoSectionProps {
  title1: string;
  description1: string;
  imageSrc1: string;
  imageAlt1: string;
  title2: string;
  description2: string;

  imageSrc2: string;
  imageAlt2: string;
  dividerImageSrc: string;

  testTypes: {
    icon: string;
    title: string;
  }[];
  testDescription: string;
}

export default function InfoSection({
  title1,
  description1,
  imageSrc1,
  imageAlt1,
  title2,
  description2,
  imageSrc2,
  imageAlt2,
  dividerImageSrc,

  testTypes,
  testDescription,
}: InfoSectionProps) {
  return (
    <div className="py-3 sm:py-9 bg-white">
      <div className="w-[80%]  mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* First Column: Text + Image */}
        <div className="flex flex-col justify-between gap-2 h-full w-full">
          {/* Text Content */}
          <div>
            <h4 className=" font-bold mb-4">{title1}</h4>
            <p className="text-gray-600 leading-relaxed">{description1}</p>
          </div>
          {/* Image */}
          <div className="imgdiv">
            <Image
              className="w-[100%] mt-2 md:mt-14"
              src={imageSrc2}
              alt={imageAlt2}
              width={200}
              height={200}
            />
          </div>
        </div>

        {/* Second Column: Divider */}
        <div className="hidden md:flex justify-center w-[40%]">
          <Image
            src={dividerImageSrc}
            alt="Divider"
            className="h-80 w-auto"
            width={200}
            height={200}
          />
        </div>

        {/* Third Column: Image + Text + Test Types Section */}
        <div className="flex flex-col gap-4 w-full">
          {/* Image */}
          <div className="imgdiv w-full mt-4 md:mt-0">
            <Image
              src={imageSrc1}
              alt={imageAlt1}
              className="w-full"
              width={200}
              height={200}
            />
          </div>
          {/* Text Content */}
          <div>
            <h4 className="font-bold mb-4">{title2}</h4>
            <p className="text-gray-600 leading-relaxed">{description2}</p>
          </div>

          {/* IELTS Test Types Section */}
          <div className="w-full">
            {/* Test Types */}
            <div className="flex flex-col lg:flex-row gap-2">
              {testTypes.map((testType, index) => (
                <div key={index} className="flex items-center gap-4 w-full">
                  <div className=" bg-[#FCE7D2] p-2 rounded-full shadow-md">
                    <Image
                      src={testType.icon}
                      alt={testType.title}
                      width={25}
                      height={25}
                    />
                  </div>

                  <div>
                    <p className="font-semibold">{testType.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Test Description */}
            <p className="mt-6 text-gray-700">{testDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
