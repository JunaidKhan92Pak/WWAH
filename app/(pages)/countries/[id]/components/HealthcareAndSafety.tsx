interface InfoSectionProps {
  title1: string;
  description1: string;
  imageSrc1: string;
  imageAlt1: string;
  title2: string;
  description2: string;
  imageSrc2: string;
  imageAlt2: string;
  dividerImageSrc: string;

  testTypes1: {
    icon: string;
    title: string;
    description: string;
  }[];
  testDescription: string;
}

export default function HealthAndSafety({
  title1,
  description1,
  imageSrc1,
  imageAlt1,
  title2,
  description2,
  imageSrc2,
  imageAlt2,
  dividerImageSrc,

  testTypes1,
  testDescription,
}: InfoSectionProps) {
  return (
    <div className="py-16 bg-white">
      <div className="w-[90%]  mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col justify-between gap-2 h-full w-full">
          <div>
            <h2 className="font-bold mb-4">{title1}</h2>
            <p className="text-gray-600 leading-relaxed">{description1}</p>
          </div>
          <div className="imgdiv">
            <img className="w-[100%] mt-12" src={imageSrc1} alt={imageAlt1} />
          </div>
        </div>

        <div className="hidden md:flex justify-center w-[40%]">
          <img src={dividerImageSrc} alt="Divider" className="h-80 w-auto" />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="imgdiv w-full mt-4 md:mt-0">
            <img src={imageSrc2} alt={imageAlt2} className="w-full" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{title2}</h2>
            <p className="text-gray-600 leading-relaxed">{description2}</p>
          </div>

          <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-6">
              {testTypes1.map((testType, index) => (
                <div key={index} className="flex items-center gap-4 w-full">
                  <div className=" bg-[#FCE7D2] p-2 rounded-2xl shadow-md">
                    <img src={testType.icon} alt={testType.title} />
                  </div>
                  <div>
                    <p className="font-semibold">{testType.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-gray-700">{testDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
