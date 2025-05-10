"use client"
import React, { useEffect, useState } from 'react';
import Coursesection from './components/Coursesection';
import Overviewsection from './components/Overviewsec';
import Standsection from './components/Standsection';
import Keyhighlights from './components/Keyhighlights';
import GalwayCampuslife from './components/GalwayCampuslife';
import AboutGalway from './components/AboutGalway';
import Exploresection from './components/Exploresection';
import Herosec from './components/Herosec';
import { HeroSkeleton } from '@/components/HeroSkeleton';
import FAQ from '@/components/ui/enrollment/FAQ';
import Banner from '@/components/ui/enrollment/Banner';
import { Button } from "@/components/ui/button";

type Tab = {
  label: string;
  id: string;
};

type UniversityData = {
  university_name: string;
  country_name: string;
  overview: string;
  origin_and_establishment: string;
  establishment_year: string;
  modern_day_development: string;
  university_video: string;
  universityImages: {
    banner: string
    logo: string
    campus_sports_recreation: string;
    campus_accommodation: string;
    campus_transportation: string;
    campus_student_services: string;
    campus_cultural_diversity: string;
    city_historical_places_1: string;
    city_historical_places_2: string;
    city_historical_places_3: string;
    city_food_and_cafe_1: string;
    city_food_and_cafe_2: string;
    city_food_and_cafe_3: string;
    city_transportation_1: string;
    city_transportation_2: string;
    city_transportation_3: string;
    city_cultures_1: string;
    city_cultures_2: string;
    city_cultures_3: string;
    city_famous_places_1: string;
    city_famous_places_2: string;
    city_famous_places_3: string;
    campus_alumni_network: string;
  };
  our_mission: string;
  our_values: string[];
  ranking: [];
  notable_alumni: [];
  key_achievements: [];
  campus_life: {
    sports_recreation: string;
    accommodation: string;
    transportation: string;
    student_services: string;
    cultural_diversity: string;
    alumni_network_support: string;
  };
  about_city: {
    historical_places: string;
    food_and_cafe: string;
    famous_places_to_visit: string[];
    cultures: string;
    transportation: string;
  };
  faq: []
};

type ApiResponse = {
  universityData: UniversityData;
};
// export default function Page({ params }: { params: { id: string } }) {
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState<string>("Programs");

  const tabs: Tab[] = [
    { label: "Programs", id: "courses" },
    { label: "Overview", id: "overview" },
    { label: "Rankings & Achievements", id: "key-highlights" },
    { label: "Campus Life", id: "campus-life" },
    { label: "About City", id: "about-city" },
  ];

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.label);
    setTimeout(() => {
      const section = document.getElementById(tab.id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/university?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch course data");
        const jsonData = await res.json();

        if (jsonData && jsonData.universityData) {
          setData(jsonData);
          document.title = jsonData.universityData.university_name;
        } else {
          throw new Error("Invalid university data received from API");
        }
      } catch (err: unknown) {
        document.title = "University Not Found";

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);
  console.log(data, "data.universityData?.faqs")
  if (loading) return <HeroSkeleton />;
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.universityData) return <p>Course Not Found</p>;
  return (
    <div>
      <Herosec data={data.universityData} />
      <div>
        <div className="bg-white my-6 md:mt-12 md:mb-12">
          <div className="w-[95%] mx-auto px-6">
            <div className="w-full lg:w-[95%] flex overflow-x-auto hide-scrollbar border-b border-gray-200 mt-4">
              {tabs.map((tab) => (
                <Button
                  key={tab.label}
                  onClick={() => handleTabClick(tab)}
                  className={`border-b md:border-none font-medium text-left md:text-center transition px-4 md:text-[16px] text-[12px] md:py-2 py-1 md:rounded-t-xl  border-gray-400  w-full hover:bg-[#FCE7D2] hover:text-black ${
                    activeTab === tab.label
                      ? "bg-[#C7161E] text-white"
                      : "bg-transparent text-gray-800"
                  }
                          hover:bg-[#FCE7D2] hover:text-black`}
                  aria-label={`Navigate to ${tab.label}`}
                  aria-selected={activeTab === tab.label}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Coursesection name={data.universityData.university_name} />
      <div id="overview" className="scroll-mt-24">
        <Overviewsection
          name={data.universityData.university_name}
          overview={data.universityData.overview}
          origin_and_establishment={
            data.universityData.origin_and_establishment
          }
          year={data.universityData.establishment_year}
          modrenday={data.universityData.modern_day_development}
          univideo={data.universityData.university_video}
          image={data.universityData.universityImages?.banner || ""} // Ensure a fallback empty string
        />
      </div>
      <Standsection
        our_mission={data.universityData.our_mission || "Mission not available"}
        values={data.universityData.our_values ?? []}
      />
      <div id="key-highlights" className="scroll-mt-24">
        <Keyhighlights
          ranking={data.universityData.ranking ?? []}
          notable_alumni={data.universityData.notable_alumni ?? []}
          key_achievements={data.universityData.key_achievements ?? []}
        />
      </div>
      <div id="campus-life" className="scroll-mt-24">
        <GalwayCampuslife
          images={data?.universityData.universityImages}
          data={data.universityData.campus_life}
          uniname={data.universityData.university_name}
        />
      </div>
      <div id="about-city" className="scroll-mt-24">
        <AboutGalway
          city={data.universityData.about_city}
          images={data?.universityData.universityImages || null}
        />
      </div>
      <Banner
        title="Turn your Study Abroad dreams into Reality!"
        buttonText="Book a Personalized Session with WWAH today."
        buttonLink="/schedulesession"
        backgroundImage="/bg-usa.png"
      />
      <FAQ
        title="Frequently Asked Questions:"
        items={data?.universityData?.faq || []}
      />

      <Exploresection
        countryName={data?.universityData?.country_name}
        uniname={data.universityData.university_name}
      />
    </div>
  );
}
