"use client";
import { useState } from "react";

import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const intakeYears = ["2025", "2026", "2027"];
const countries = [
  { value: "uk", label: "United Kingdom" },
  { value: "new_zealand", label: "New Zealand" },
  { value: "australia", label: "Australia" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" },
  { value: "malaysia", label: "Malaysia" },
  { value: "ireland", label: "Ireland" },
  { value: "usa", label: "USA" },
  { value: "china", label: "China" },
  { value: "italy", label: "Italy" },
];

const universities = [
  { value: "harvard", label: "Harvard" },
  { value: "oxford", label: "Oxford" },
  { value: "cambridge", label: "Cambridge" },
  { value: "mit", label: "MIT" },
  { value: "stanford", label: "Stanford" },
];

const students = [
  { id: "s001", name: "John Doe" },
  { id: "s002", name: "Jane Smith" },
  { id: "s003", name: "Alice Johnson" },
  { id: "s004", name: "Bob Brown" },
];
const ApplicationStatusTracker = () => {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const toggleYear = (year: string) => {
    setSelectedYear((prev) => (prev === year ? null : year));
  };
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const toggleMonth = (month: string) => {
    setSelectedMonth((prev) => (prev === month ? null : month));
  };

  // Example months array:
  const intakeMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    undefined
  );
  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [universitySearchTerm, setUniversitySearchTerm] = useState("");
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] =
    useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<
    string | undefined
  >(undefined);

  const filteredUniversities = universities.filter((uni) =>
    uni.label.toLowerCase().includes(universitySearchTerm.toLowerCase())
  );

  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | undefined>(
    undefined
  );

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.id}`
      .toLowerCase()
      .includes(studentSearchTerm.toLowerCase())
  );


  // second design
  //  const applicationDetails = [
  //   { src: "/location.svg", alt: "Location", text: "New Zealand" },
  //   { src: "/DashboardPage/intake.svg", alt: "Intake", text: "2024" },
  //   { src: "/clock.svg", alt: "Duration", text: "4 Years" },
  //   { src: "/money.svg", alt: "Tuition Fee", text: "$ 53,122" },
  //   {
  //     src: "/DashboardPage/deadline.svg",
  //     alt: "Deadline",
  //     text: "February 2025",
  //     isDeadline: true,
  //   },
  // ];
  //  const progressSteps = [
  //   "Complete Application",
  //   "Applied",
  //   "Offer Letter Received",
  //   "Confirm Enrollment",
  //   "Visa Granted",
  //   "Accommodation Booked",
  //   "Airport Pickup Booked",
  // ];
  return (
    <>
      <div className="col-span-1">
        <div className="flex flex-col items-center justify-center text-center border rounded-2xl">
          <div className="flex flex-col gap-2 items-start w-full pl-4 pt-2">
            <h5>Application status tracker</h5>
            <div className="flex items-center gap-2 w-full">
              {/* <Button
                         size="sm"
                         className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-10"
                       >
                         <Image
                           src="/partnersportal/Filter.svg" 
                           alt="Filters"
                           width={16}
                           height={16}
                           className=""
                         />
                         Filters
                       </Button> */}
              <Dialog open={open} onOpenChange={setOpen}>
                {/* Trigger Button */}
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-10 flex gap-2 items-center"
                  >
                    <Image
                      src="/partnersportal/Filter.svg"
                      alt="Filters"
                      width={15}
                      height={15}
                    />
                    Filters
                  </Button>
                </DialogTrigger>

                {/* Modal Content */}
                <DialogContent
                  className="!rounded-2xl  max-w-[350px] md:max-w-[450px] max-h-[350px] md:max-h-[400px] xl:max-h-[510px] overflow-y-scroll"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <DialogHeader>
                    <DialogTitle className="mb-2 text-start">
                      Filter Applications by
                    </DialogTitle>
                    <div className="w-full h-px bg-gray-300" />
                  </DialogHeader>

                  <div className="space-y-2">
                    {/* Student Name or ID */}
                    <div>
                      <label className="text-sm font-medium">
                        Student name or ID
                      </label>
                      <div className="relative">
                        <Select
                          value={selectedStudent}
                          onValueChange={(value) => {
                            setSelectedStudent(value);
                            setIsStudentDropdownOpen(false);
                            setStudentSearchTerm("");
                          }}
                          onOpenChange={(open) => {
                            setIsStudentDropdownOpen(open);
                            if (!open) setStudentSearchTerm("");
                          }}
                        >
                          <SelectTrigger className="pl-3">
                            <SelectValue />
                            {!isStudentDropdownOpen && !selectedStudent && (
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            )}
                          </SelectTrigger>

                          <SelectContent>
                            {isStudentDropdownOpen && (
                              <div className="p-2">
                                <input
                                  type="text"
                                  placeholder="Type name or ID..."
                                  value={studentSearchTerm}
                                  onChange={(e) =>
                                    setStudentSearchTerm(e.target.value)
                                  }
                                  className="w-full px-2 py-1 border rounded"
                                  autoFocus
                                />
                              </div>
                            )}

                            {filteredStudents.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} ({student.id})
                              </SelectItem>
                            ))}

                            {filteredStudents.length === 0 && (
                              <div className="p-2 text-gray-500">
                                No results found
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="text-sm font-medium">Country</label>
                      <div className="relative">
                        <Select
                          value={selectedCountry}
                          onValueChange={(value) => {
                            setSelectedCountry(value);
                            setIsDropdownOpen(false); // close dropdown after selection if needed
                            setSearchTerm("");
                          }}
                          onOpenChange={(open) => {
                            setIsDropdownOpen(open);
                            if (!open) setSearchTerm("");
                          }}
                        >
                          <SelectTrigger className="pl-3">
                            <SelectValue />
                            {/* Show icon only when dropdown is closed AND no country selected */}
                            {!isDropdownOpen && !selectedCountry && (
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            )}
                          </SelectTrigger>

                          <SelectContent>
                            {isDropdownOpen && (
                              <div className="p-2">
                                <input
                                  type="text"
                                  placeholder="Search country..."
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  className="w-full px-2 py-1 border rounded"
                                  autoFocus
                                />
                              </div>
                            )}

                            {filteredCountries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}

                            {filteredCountries.length === 0 && (
                              <div className="p-2 text-gray-500">
                                No results found
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* University */}
                    <div>
                      <label className="text-sm font-medium">University</label>
                      <div className="relative">
                        <Select
                          value={selectedUniversity}
                          onValueChange={(value) => {
                            setSelectedUniversity(value);
                            setIsUniversityDropdownOpen(false);
                            setUniversitySearchTerm("");
                          }}
                          onOpenChange={(open) => {
                            setIsUniversityDropdownOpen(open);
                            if (!open) setUniversitySearchTerm("");
                          }}
                        >
                          <SelectTrigger className="pl-3">
                            <SelectValue />
                            {!isUniversityDropdownOpen &&
                              !selectedUniversity && (
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                              )}
                          </SelectTrigger>

                          <SelectContent>
                            {isUniversityDropdownOpen && (
                              <div className="p-2">
                                <input
                                  type="text"
                                  placeholder="Search university..."
                                  value={universitySearchTerm}
                                  onChange={(e) =>
                                    setUniversitySearchTerm(e.target.value)
                                  }
                                  className="w-full px-2 py-1 border rounded"
                                  autoFocus
                                />
                              </div>
                            )}

                            {filteredUniversities.map((uni) => (
                              <SelectItem key={uni.value} value={uni.value}>
                                {uni.label}
                              </SelectItem>
                            ))}

                            {filteredUniversities.length === 0 && (
                              <div className="p-2 text-gray-500">
                                No results found
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Intake Year */}
                    <div>
                      <Label
                        className="text-sm font-medium"
                        htmlFor="intake-year"
                      >
                        Intake Year
                      </Label>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="intake-year"
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <span>{selectedYear ?? "Select"}</span>
                            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                          {intakeYears.map((year) => (
                            <div
                              key={year}
                              className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                              onClick={() => toggleYear(year)}
                            >
                              <span>{year}</span>
                              <Checkbox
                                checked={selectedYear === year}
                                onCheckedChange={() => toggleYear(year)}
                              />
                            </div>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Intake Month */}
                    <div>
                      <Label
                        className="text-sm font-medium"
                        htmlFor="intake-month"
                      >
                        Intake Month
                      </Label>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="intake-month"
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <span>{selectedMonth ?? "Select"}</span>
                            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                          {intakeMonths.map((month) => (
                            <div
                              key={month}
                              className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                              onClick={() => toggleMonth(month)}
                            >
                              <span>{month}</span>
                              <Checkbox
                                checked={selectedMonth === month}
                                onCheckedChange={() => toggleMonth(month)}
                              />
                            </div>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </div>


                    {/* Footer Buttons */}
                    <div className="flex justify-between gap-2 pt-3">
                      <Button variant="outline" className="w-1/2">
                        Clear Filters
                      </Button>
                      <Button className="bg-red-600 text-white w-1/2 hover:bg-red-700">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              {/* <Button size="sm" className="bg-white border hover:bg-gray-100">
                <Image
                  src="/partnersportal/dots.svg"
                  alt="More"
                  width={4}
                  height={4}
                />
              </Button> */}
            </div>
          </div>
          <Image
            src="/partnersportal/nodata.svg"
            alt="No Data"
            width={200}
            height={200}
          /> 
          <h5>No Data Available to Display</h5>
          <p>Please apply filters to view relevant results.</p>

               
              {/* <div className="bg-[#FCE7D280] rounded-xl border md:my-4 py-5 w-[95%]">
                <div className="flex flex-col sm:flex-row gap-6 w-[95%] mx-auto items-center md:items-start">
                  <Image
                    src="/course1.svg"
                    alt="courseImg"
                    width={600}
                    height={500}
                    className="h-auto md:h-48 w-[350px] md:w-[240px] object-cover rounded-2xl"
                  />
          
                  <div className="flex flex-col gap-3 items-start">
                    <p className="font-semibold text-lg text-start">
                      Bachelor of Engineering (Honors) - BE(Hons)
                    </p>
          
                    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                      {applicationDetails.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 ${
                            item.isDeadline ? "col-span-2" : ""
                          }`}
                        >
                          <Image src={item.src} width={18} height={18} alt={item.alt} />
                          {item.isDeadline ? (
                            <>
                              <p className="text-base">Deadline:</p>
                              <p className="text-base ml-6 md:ml-12">{item.text}</p>
                            </>
                          ) : (
                            <p className="text-base">{item.text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
          
                <div className="relative w-full mt-6 h-20">
                  <div className="flex justify-between items-center w-[90%] mx-auto relative">
                    <div className="absolute top-[50%] left-0 w-full h-1 bg-gray-300 z-[-1]"></div>
          
                    {progressSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center relative group"
                      >
                        <div
                          className={`w-6 md:w-7 h-6 md:h-7 flex items-center justify-center rounded-full 
                            ${
                              index === 0
                                ? "bg-red-600 text-white"
                                : "bg-gray-500 text-white"
                            }
                            font-bold text-sm`}
                        >
                          {index + 1}
                        </div>
          
                        <p
                          className="hidden md:block absolute top-[24px] text-xs text-gray-700 text-center 
                          w-[96px] leading-normal break-words mt-3"
                        >
                          {step}
                        </p>
          
                        <p
                          className="absolute top-[24px] text-xs text-gray-700 text-center 
                          md:w-[85px] leading-normal break-words mt-3 bg-white shadow-lg p-1 rounded-md 
                          hidden group-hover:block md:hidden z-10"
                        >
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}

        </div>
      </div>
    </>
  );
};

export default ApplicationStatusTracker;
