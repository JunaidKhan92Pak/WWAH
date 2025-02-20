import React from 'react';

interface OnlineOfflineProps {
  title: string;
  description: string;
}

const OnlineOffline: React.FC<OnlineOfflineProps> = ({ title, description }) => {
  return (
    <section className="flex items-center justify-center mt-8">
      <div className="text-center w-full sm:w-[80%] md:w-[70%] ">
        <h3 className=" text-[#313131]">
          {title}
        </h3>

        <p className="mt-4  text-[#313131] px-6 sm:px-0 text-justify sm:text-center">
          {description}
        </p>
      </div>
    </section>
  );
};

export default OnlineOffline;
