import React from "react";
import Herosection from "./components/Herosection";
import PreparationWithWWAH from "./components/PreparationWithWWAH";
import RatingSection from "./components/Ratingsection";
import ScheduleTable from "./components/Schedulesection";
import Formsection from "./components/Formsection";

const page = () => {
  return (
    <>
      <Herosection />
      <PreparationWithWWAH />
      <RatingSection />
      <ScheduleTable />
      <Formsection/>
    </>
  );
};

export default page;
