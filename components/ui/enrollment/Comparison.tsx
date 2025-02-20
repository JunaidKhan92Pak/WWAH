import Image from "next/image";


interface ComparisonItem {
    title: string;
    description: string;
  }
  
  interface ComparisonSectionProps {
    leftItem: ComparisonItem;
    rightItem: ComparisonItem;
  }
  
  export default function ComparisonSection({ leftItem, rightItem }: ComparisonSectionProps) {
    return (
      <div className="py-6 bg-black text-white">
        <div className="max-w-[93%] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div>
              <h5 className="font-bold mb-4">{leftItem.title}</h5>
              <p className="text-gray-300">{leftItem.description}</p>
            </div>
            <div className="imgdiv w-[12%] md:w-[45%] xl:w-[33%]">
                <Image src="/vs.png" alt="vs" width={100} height={100} />
            </div>
            <div>
              <h5 className="font-bold mb-4">{rightItem.title}</h5>
              <p className="text-gray-300">{rightItem.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }