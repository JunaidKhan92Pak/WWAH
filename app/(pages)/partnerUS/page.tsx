import React from "react";
import PartnerUsHero from "./components/PartnerUsHero";
import PartnershipServices from "./components/PartnershipServices";
import GlobalCollab from "./components/GlobalCollab";
import GlobalNetwork from "./components/GlobalNetwork";
import Banner from "@/components/ui/enrollment/Banner";
import StepWiseGuide from "./components/StepWiseGuide";
import AItool from "./components/AItool";

function page() {
  return (
    <div>
      <PartnerUsHero />
      <PartnershipServices />
      <GlobalCollab />
      <AItool/>
      <GlobalNetwork />
      <StepWiseGuide/>
      <Banner
        title="Collaborate with us to enhance your business reach & impact students worldwide!"
        buttonText="Partner with Us"
        buttonLink="#"
        backgroundImage="/bg-usa.png"
      />
    </div>
  );
}

export default page;
