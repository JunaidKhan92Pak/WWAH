import React from "react";

function AboutUsHero() {
  return (
    <div className="relative flex items-center justify-center py-4 sm:py-0 h-[180px] sm:h-[75vh] w-[95%] mx-auto rounded-2xl md:mt-4 overflow-hidden">
      {/* <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
      >
        <source src="./WWAH.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <video autoPlay loop muted className="w-full h-full object-cover">
        <source src="/WWAH.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default AboutUsHero;
