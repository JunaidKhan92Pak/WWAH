import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
  title: string;
  buttonText: string;
  backgroundImage: string;
}

export default function Hero({
  title,
  buttonText,
  backgroundImage,
}: HeroProps) {
  return (
    <div
      className="relative flex items-center justify-center h-[270px] sm:h-[80vh]  w-[95%] mx-auto my-4 rounded-2xl"
      style={{
        backgroundImage: ` url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl w-[80%] px-4 sm:px-6 lg:px-8">
        <div className="text-white text-left">
          <h1 className="  mb-4 w-[100%] lg:w-[50%]">{title}</h1>
          <Link href="/form">
            <Button variant="destructive" className="bg-red-700" size="lg">
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
