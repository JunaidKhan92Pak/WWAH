import React from "react";

function AboutUsHero() {
  return (
    <div
      className="relative flex items-center justify-center py-4 sm:py-0 h-[150px] sm:h-[75vh] w-[90%] mx-auto rounded-2xl md:mt-4"     
      style={{
        backgroundImage: ` url(${"./aboutUsBg.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[90%]">
        <div className="text-white text-left w-[90%]">
          <h1 className="w-full">
            WHY <span className="text-[#DD7378]"> CHOOSE</span> WWAH?
          </h1>
          <p className="leading-4 md:leading-normal w-[100%] sm:w-[60%]">
            Welcome to Worldwide Admissions Hub, your gateway to a world of
            educational opportunities. Our AI driven platform is designed to
            simplify and enhance the admissions process for students and
            educational institutions alike. 
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUsHero;