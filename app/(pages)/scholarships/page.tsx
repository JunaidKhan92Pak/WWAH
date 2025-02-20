"use client"
import React from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Page = () => {

  const courseArr = [
    {
      UniImg: "/course1.svg",
      title: "KAIST University Scholarship",
      UniName: "Korea Advanced Institute of Science & Technology (KAIST)",
      locationIcon: "/location.svg",
      country: "USA",
      scholarshipIcon: "/money.svg",
      scholarship: "Fully Funded",
      studyIcon: "/Notebook.svg",
      studyLevel: "Master",
      dateIcon: "/clock.svg",
      Date: "March 2025",
    },
    {
      UniImg: "/course1.svg",
      title: "KAIST University Scholarship",
      UniName: "Korea Advanced Institute of Science & Technology (KAIST)",
      locationIcon: "/location.svg",
      country: "USA",
      scholarshipIcon: "/money.svg",
      scholarship: "Partial Funded",
      studyIcon: "/Notebook.svg",
      studyLevel: "bachelors",
      dateIcon: "/clock.svg",
      Date: "March 2025",
    },
    {
      UniImg: "/course1.svg",
      title: "KAIST University Scholarship",
      UniName: "Korea Advanced Institute of Science & Technology (KAIST)",
      locationIcon: "/location.svg",
      country: "New Zealand",
      scholarshipIcon: "/money.svg",
      scholarship: "Partial Funded",
      studyIcon: "/Notebook.svg",
      studyLevel: "bachelors",
      dateIcon: "/clock.svg",
      Date: "Jan 2025",
    },
    {
      UniImg: "/course1.svg",
      title: "KAIST University Scholarship",
      UniName: "Korea Advanced Institute of Science & Technology (KAIST)",
      locationIcon: "/location.svg",
      country: "UK",
      scholarshipIcon: "/money.svg",
      scholarship: "Partial Funded",
      studyIcon: "/Notebook.svg",
      studyLevel: "bachelors",
      dateIcon: "/clock.svg",
      Date: "Jan 2025",
    },
    {
      UniImg: "/course1.svg",
      title: "KAIST University Scholarship",
      UniName: "Korea Advanced Institute of Science & Technology (KAIST)",
      locationIcon: "/location.svg",
      country: "Denmark",
      scholarshipIcon: "/money.svg",
      scholarship: "Fully Funded",
      studyIcon: "/Notebook.svg",
      studyLevel: "Master",
      dateIcon: "/clock.svg",
      Date: "Jan 2025",
    },
    {
      UniImg: "/course1.svg",
      title: "KAIST University Scholarship",
      UniName: "Korea Advanced Institute of Science & Technology (KAIST)",
      locationIcon: "/location.svg",
      country: "China",
      scholarshipIcon: "/money.svg",
      scholarship: "Fully Funded",
      studyIcon: "/Notebook.svg",
      studyLevel: "PhD",
      dateIcon: "/clock.svg",
      Date: "Feb 2025",
    },
    {
      UniImg: "/course1.svg",
      title: "KAIST University Scholarship",
      UniName: "Korea Advanced Institute of Science & Technology (KAIST)",
      locationIcon: "/location.svg",
      country: "China",
      scholarshipIcon: "/money.svg",
      scholarship: "Partial Funded",
      studyIcon: "/Notebook.svg",
      studyLevel: "PhD",
      dateIcon: "/clock.svg",
      Date: "Feb 2025",
    },
    {
      UniImg: "/course1.svg",
      title: "KAIST University Scholarship",
      UniName: "Korea Advanced Institute of Science & Technology (KAIST)",
      locationIcon: "/location.svg",
      country: "China",
      scholarshipIcon: "/money.svg",
      scholarship: "Fully Funded",
      studyIcon: "/Notebook.svg",
      studyLevel: "bachelors",
      dateIcon: "/clock.svg",
      Date: "Feb 2025",
    },
    {
      UniImg: "/course1.svg",
      title: "KAIST University Scholarship",
      UniName: "Korea Advanced Institute of Science & Technology (KAIST)",
      locationIcon: "/location.svg",
      country: "France",
      scholarshipIcon: "/money.svg",
      scholarship: "Fully Funded",
      studyIcon: "/Notebook.svg",
      studyLevel: "bachelors",
      dateIcon: "/clock.svg",
      Date: "Feb 2025",
    },

  ];
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [selectedInfo, setSelectedInfo] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value) // Remove value if it's already stored
        : [...prev, value] // Add value if it's not already stored
    );

  };
  const handleInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedInfo((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value) // Remove value if it's already stored
        : [...prev, value] // Add value if it's not already stored
    );

  };

  //  This filter The Country from  coursesArr
  let filterCountry = courseArr.filter((course) => {
    if (selectedValues.length === 0) {
      return course; // No filters applied, return all
    }
    return (
      selectedValues.includes(course.country.toLowerCase())
    );
  })

  //This filter the selectedInfo from the filterCountry
  filterCountry = filterCountry.filter((course) => {
    if (!selectedInfo.length) return true; // No filters applied, return all courses

    // Normalize and check all conditions
    const normalizedValues = [
      course.studyLevel?.toLowerCase().trim(),
      course.scholarship?.toLowerCase().trim(),
      course.Date?.toLowerCase().trim(),
    ];

    return selectedInfo.some(info =>
      normalizedValues.includes(info.toLowerCase().trim())
    );
  });
  //This filter the search from the filterCountry
  filterCountry = filterCountry.filter((course) => { // Filter by search
    return course.scholarship.toLowerCase().includes(search.toLowerCase()); // Return courses that include the search term    
  });

  return (
    <>
      <div className="w-[90%] mx-auto">
   
      </div>
      <Sheet >
        <SheetTrigger>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="md:hidden mb-4 mx-4  bg-gray-100 border-2 border-gray-200"
          >
            {/* <Menu /> */}
            <div className="flex items-center w-[100px] justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/filterr.svg"
                  width={12}
                  height={12}
                  alt="favourite"
                  className=" "
                />
                <p className="font-bold">Filters</p>
              </div>
              <Image
                src="/right-arrow.png"
                alt="arrow"
                width={10}
                height={10}
              />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0">
          <div className="p-2">
            <section className=" ">
              <div className="flex bg-[#F1F1F1]  mx-2 mb-2 w-[80%] px-2 rounded-lg">
                <Input
                  placeholder="Search Scholarships..."
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-none bg-[#F1F1F1] outline-none focus:ring-0 placeholder:text-[12px]"
                />
                <Image
                  src="/search.svg"
                  width={16}
                  height={16}
                  alt="favourite"
                  className="2xl:w-[40px] 2xl:h-[40px] ml-2"
                />
              </div>
              <hr className="mx-4" />
              <ScrollArea className="p-4 md:h-full h-[400px]">
                <h6 className="text-lg ">Country:</h6>
                <div className="">
                  <ul className="py-2 space-y-4 mb-2 ">
                    <li className="flex justify-between ">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/usa.png"
                          width={18}
                          height={18}
                          alt="favourite"
                          className="w-[26px]"
                        />
                        <label className="text-[16px]" htmlFor="us text-sm">United States</label>
                      </div>
                      <input
                        type="checkbox"
                        name="usa"
                        value="usa"
                        onChange={handleCheckboxChange}

                      />
                    </li>
                    <li className="flex justify-between ">
                      <div className="flex items-center gap-2 text-sm">
                        <Image
                          src="/china.png"
                          width={18}
                          height={18}
                          alt="favourite"
                          className="w-[26px]"
                        />
                        <label className="text-[16px]" htmlFor="us">China</label>
                      </div>
                      <input
                        type="checkbox"
                        name="china"
                        value="china"
                        onChange={handleCheckboxChange}
                      />
                    </li>
                    <li className="flex justify-between ">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/canada.png"
                          width={18}
                          height={18}
                          alt="favourite"
                          className="w-[26px]"
                        />
                        <label className="text-[16px]" htmlFor="us">Canada</label>
                      </div>
                      <input
                        type="checkbox"
                        name="canada"
                        value="canada"
                        onChange={handleCheckboxChange}
                      />
                    </li>
                    <li className="flex  justify-between ">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/italy.png"
                          width={18}
                          height={18}
                          alt="favourite"
                          className="w-[26px]"
                        />
                        <label className="text-[16px]" htmlFor="us">Italy</label>
                      </div>
                      <input
                        type="checkbox"
                        name="italy"
                        value="italy"
                        onChange={handleCheckboxChange}
                      />
                    </li>
                    <li className="flex justify-between ">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/uk.png"
                          width={18}
                          height={18}
                          alt="favourite"
                          className="w-[26px]"
                        />
                        <label className="text-[16px]" htmlFor="us">United Kingdom</label>
                      </div>
                      <input
                        type="checkbox"
                        name="uk"
                        value="uk"
                        onChange={handleCheckboxChange}
                      />
                    </li>
                    <li className="flex justify-between ">
                      <div className="flex  items-center gap-2">
                        <Image
                          src="/ireland.png"
                          width={18}
                          height={18}
                          alt="favourite"
                          className="w-[26px]"
                        />
                        <label className="text-[16px]" htmlFor="us">Ireland</label>
                      </div>
                      <input
                        type="checkbox"
                        name="ireland"
                        value="ireland"
                        onChange={handleCheckboxChange}
                      />
                    </li>
                    <li className="flex justify-between ">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/new-zealand.png"
                          width={18}
                          height={18}
                          alt="favourite"
                          className="w-[26px]"
                        />
                        <label className="text-[16px]" htmlFor="us">New Zealand</label>
                      </div>
                      <input
                        type="checkbox"
                        name="new zealand"
                        value="new zealand"
                        onChange={handleCheckboxChange}
                      />
                    </li>
                    <li className="flex justify-between ">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/denmark.png"
                          width={18}
                          height={18}
                          alt="favourite"
                          className="w-[26px]"
                        />
                        <label className="text-[16px]" htmlFor="us">Denmark</label>
                      </div>
                      <input
                        type="checkbox"
                        name="denmark"
                        value="denmark"
                        onChange={handleCheckboxChange}
                      />
                    </li>
                    <li className="flex justify-between ">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/france.png"
                          width={18}
                          height={18}
                          alt="favourite"
                          className="w-[26px]"
                        />
                        <label className="text-[16px]" htmlFor="us">France</label>
                      </div>
                      <input
                        type="checkbox"
                        name="france"
                        value="france"
                        onChange={handleCheckboxChange}
                      />
                    </li>
                  </ul>
                  <hr className="" />
                  <p className="text-lg mt-4">Programs:</p>
                  <ul className="py-2 space-y-4 mb-2">
                    <li className="flex justify-between ">
                      <label className="text-[16px]" htmlFor="us">Bachelors</label>
                      <input
                        type="checkbox"
                        name="bachelors"
                        value="bachelors"
                        onChange={handleInfoChange}

                      />
                    </li>
                    <li className="flex justify-between ">
                      <label className="text-[16px]" htmlFor="us">Master</label>
                      <input
                        type="checkbox"
                        name="master"
                        value="master"
                        onChange={handleInfoChange}

                      />
                    </li>
                    <li className="flex justify-between ">
                      <label className="text-[16px]" htmlFor="us">PhD</label>
                      <input
                        type="checkbox"
                        name="phd"
                        value="phd"
                        onChange={handleInfoChange}
                      />
                    </li>
                  </ul>
                  <hr className="" />
                  <p className="text-lg mt-4">Scholarship Type:</p>
                  <ul className="py-4 space-y-4 mb-2">
                    <li className="flex justify-between ">
                      <label className="text-[16px]" htmlFor="us">Fully Funded </label>
                      <input
                        type="checkbox"
                        name="Fully Funded"
                        value="Fully Funded"
                        onChange={handleInfoChange}
                      />
                    </li>
                    <li className="flex justify-between ">
                      <label className="text-[16px]" htmlFor="us">Partial Funded</label>
                      <input
                        type="checkbox"
                        name="Partial Funded"
                        value="Partial Funded"
                        onChange={handleInfoChange}
                      />
                    </li>
                  </ul>
                  <hr className="" />
                  <p className="text-lg mt-4">Application Deadline:</p>
                  <ul className="py-2 space-y-4">
                    <li className="flex justify-between ">
                      <label className="text-[16px]" htmlFor="us">Jan,2024</label>
                      <input
                        type="checkbox"
                        name="Jan 2025"
                        value="Jan 2025"
                        onChange={handleInfoChange}
                      />
                    </li>
                    <li className="flex justify-between ">
                      <label className="text-[16px]" htmlFor="us">Feb,2024</label>
                      <input
                        type="checkbox"
                        name="Feb 2025"
                        value="Feb 2025"
                        onChange={handleInfoChange}
                      />
                    </li>
                    <li className="flex justify-between ">
                      <label className="text-[16px]" htmlFor="us">Mar,2024</label>
                      <input
                        type="checkbox"
                        name="March 2025"
                        value="March 2025"
                        onChange={handleInfoChange}
                      />
                    </li>
                  </ul>
                </div>
              </ScrollArea>
            </section>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex justify-around gap-2 ">
        <section className="hidden md:block w-[20%] lg:w-[20%]">
          <div className="border-2 rounded-3xl p-4 md:p-0 ">
            <div className="hidden md:flex items-center gap-2 p-4 ">
              <Image
                src="/filterr.svg"
                width={20}
                height={20}
                alt="filter"
                className=""
              />
              <h6 className="font-bold">Filters</h6>     
            </div>
            <div className="flex justify-center">
            <div className="flex justify-evenly bg-[#F1F1F1] rounded-lg px-3 w-[80%] ">
              <Image
                src="/search.svg"
                width={16}
                height={16}
                alt="search"
                />
              <input
                placeholder="Search Scholarships..."
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-none bg-[#F1F1F1] outline-none focus:ring-0 flex-1 p-2 placeholder:text-[12px] w-[50%] rounded-lg"
              />
            </div>
            </div>
            <hr className="mx-4 md:m-6" />
            <ScrollArea className="p-4 h-[500px] md:h-full overflow-auto">
              <p className="font-bold">Country:</p>
              <ul className="py-4 space-y-4 md:space-y-6">
                {[
                  { name: "usa", label: "United States", img: "/usa.png" },
                  { name: "china", label: "China", img: "/china.png" },
                  { name: "canada", label: "Canada", img: "/canada.png" },
                  { name: "italy", label: "Italy", img: "/italy.png" },
                  { name: "uk", label: "United Kingdom", img: "/uk.png" },
                  { name: "ireland", label: "Ireland", img: "/ireland.png" },
                  { name: "new zealand", label: "New Zealand", img: "/new-zealand.png" },
                  { name: "denmark", label: "Denmark", img: "/denmark.png" },
                  { name: "france", label: "France", img: "/france.png" },
                ].map((country) => (
                  <li key={country.name} className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Image
                        src={country.img}
                        width={30}
                        height={30}
                        alt={country.label}
                        className="w-[20px] md:w-[30px] 2xl:w-[42px]"
                      />
                      <label htmlFor={country.name} className="text-sm md:text-base">
                        {country.label}
                      </label>
                    </div>
                    <input
                      type="checkbox"
                      name={country.name}
                      value={country.name}
                      onChange={handleCheckboxChange}
                    />
                  </li>
                ))}
              </ul>
              <p className="text-base md:text-xl">Programs:</p>
              <ul className="py-4 space-y-4 md:space-y-6">
                {["Bachelors", "Master", "PhD"].map((program) => (
                  <li key={program} className="flex justify-between items-center">
                    <label htmlFor={program.toLowerCase()} className="text-sm md:text-base">
                      {program}
                    </label>
                    <input
                      type="checkbox"
                      name={program.toLowerCase()}
                      value={program.toLowerCase()}
                      onChange={handleInfoChange}
                    />
                  </li>
                ))}
              </ul>
              <p className="text-base md:text-xl">Scholarship Type:</p>
              <ul className="py-4 space-y-4 md:space-y-6">
                {["Fully Funded", "Partial Funded"].map((type) => (
                  <li key={type} className="flex justify-between items-center">
                    <label htmlFor={type} className="text-sm md:text-base">
                      {type}
                    </label>
                    <input
                      type="checkbox"
                      name={type}
                      value={type}
                      onChange={handleInfoChange}
                    />
                  </li>
                ))}
              </ul>
              <p className="text-base md:text-xl">Application Deadline:</p>
              <ul className="py-4 space-y-4 md:space-y-6">
                {["Jan 2025", "Feb 2025", "March 2025"].map((deadline) => (
                  <li key={deadline} className="flex justify-between items-center">
                    <label htmlFor={deadline} className="text-sm md:text-base">
                      {deadline}
                    </label>
                    <input
                      type="checkbox"
                      name={deadline}
                      value={deadline}
                      onChange={handleInfoChange}
                    />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </section>
        <section className="md:w-[75%] w-[90%]">
          {/* All University Section */}
          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:py-2 flex flex-col ">
              <h3 className="font-bold w-4/5 text-start">Find the Right Scholarship for Your Academic Journey!
              </h3>
              {/* <p className="text-sm">Showing Scholarships in United States:</p> */}
            </div>
            <div className="flex items-center  justify-start md:justify-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg py-2 px-4 md:p-3">
                <Image
                  src="/hearti.png"
                  width={20} // Adjust to match screenshot
                  height={20}
                  alt="favourite"
                  className=""
                />
                <span className="text-sm text-gray-600 pr-2">
                  Favorites
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-2">
            {filterCountry.map((course, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col p-3"
              >
                {/* Image Section */}
                <div>
                  <Image
                    src={course.UniImg}
                    alt="University Image"
                    width={400}
                    height={250}
                    className="w-full object-cover"
                    />
                </div>

                {/* Content Section */}
                <div className="p-2 flex-grow">
                  <p className="font-bold">{course.title}</p>
                  <p className="text-sm md:text-base">{course.UniName}</p>

                  <div className="flex justify-between flex-wrap">
                    <div className="flex items-center gap-2 mt-2">
                      <Image
                        src={course.locationIcon}
                        alt="location"
                        width={16}
                        height={16}
                      />
                      <p className="text-sm md:text-base text-gray-600 font-bold">
                        {course.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Image
                        src={course.scholarshipIcon}
                        alt="year"
                        width={16}
                        height={16}
                      />
                      <p className="text-sm md:text-base text-gray-600 font-bold">
                        {course.scholarship}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between flex-wrap">
                    <div className="flex items-center gap-2 mt-2">
                      <Image
                        src={course.studyIcon}
                        alt="duration"
                        width={16}
                        height={16}
                      />
                      <p className="text-sm md:text-base text-gray-600 font-bold">
                      {course.studyLevel}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Image
                        src={course.dateIcon}
                        alt="fees"
                        width={16}
                        height={16}
                      />
                      <p className="text-sm md:text-base text-gray-600 font-bold">
                        {course.Date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="mx-4 mb-4" />

                {/* Buttons Section */}
                <div className="flex gap-2 flex-row justify-evenly mb-1 px-2">
                  <button className="md:w-[50%] w-[40%] border border-[#F0851D] text-[#F0851D] hover:bg-red-500 hover:text-white text-[12px]  md:text-md md:px-3 md:py-1 rounded-lg  sm:w-auto">
                    View Details
                  </button>
                  <button className=" w-[50%] border border-[#F0851D] text-[#F0851D] text-[12px] hover:bg-red-500 hover:text-white md:text-md md:px-3 py-1 rounded-lg  sm:w-auto">
                    Start Your Application
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="w-28 mx-auto py-10">
            <div className="flex justify-between items-center">
              <p>Show More</p>
              <Image src="/arrowDown.png" alt="arrow" width={20} height={20} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
