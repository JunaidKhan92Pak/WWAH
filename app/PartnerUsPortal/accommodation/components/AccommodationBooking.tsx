"use client";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { countries } from "@/lib/countries"; // Adjust path as needed

import { SearchIcon } from "lucide-react";
const accommodationTypes = [
  "Single Apartment",
  "Shared Apartment",
  "Hostel",
  "Home Says",
];

const AccommodationBooking = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.focus();
  };

  const [open, setOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const statuses = [
    "Pending",
    "Under Review",
    "Payment Required",
    "Booked",
    "Canceled",
    "Completed",
  ];

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? null : status));
  };

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (key: string) => {
    setSelected((prev) => (prev === key ? null : key)); // toggle off if clicked again
  };

  const [selectedAccommodation, setSelectedAccommodation] = useState<
    string | null
  >(null);

  const toggleAccommodation = (type: string) => {
    setSelectedAccommodation((prev) => (prev === type ? null : type));
  };

  const [selectedValue, setSelectedValue] = useState("+92-Pakistan");

  const selectedCountry = countries.find(
    (c) => `${c.code}-${c.name}` === selectedValue
  );
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center mt-6 mb-4 gap-4">
        <div className="flex flex-col">
          <div className="relative w-50 md:w-72">
            <FiSearch
              onClick={handleIconClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            />
            <Input
              ref={inputRef}
              placeholder="Search by Student Name or Student ID or Application ID"
              className="bg-gray-100 placeholder-[#313131] placeholder:text-sm pr-10"
            />
          </div>
          {/* <FaSearch className="absolute right-3 text-gray-500" /> */}
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          {/* <Button
                                  size="sm"
                                  className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-10 py-5 flex gap-2 items-center"
                                >
                                  <Image
                                    src="/partnersportal/Filter.svg"
                                    alt="Filters"
                                    width={15}
                                    height={15}
                                  />
                                  Filters
                                </Button> */}

          {/* Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => setOpen(true)}
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-10 py-5 flex gap-2 items-center"
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
            <DialogContent
              className="!rounded-2xl  max-w-[350px] md:max-w-[450px] max-h-[350px] md:max-h-[400px] xl:max-h-[510px] overflow-y-scroll"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <DialogHeader>
                <DialogTitle className="text-start w-[80%]">
                  Filter Accommodation & Airport Booking Assitance by
                </DialogTitle>
              </DialogHeader>

              {/* Filter Fields */}
              <div className="space-y-2">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="united-kingdom">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="new-zealand">New Zealand</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="germany">Germany</SelectItem>
                      <SelectItem value="malaysia">Malaysia</SelectItem>
                      <SelectItem value="ireland">Ireland</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="china">China</SelectItem>
                      <SelectItem value="italy">Italy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="london">London</SelectItem>
                      <SelectItem value="auckland">Auckland</SelectItem>
                      <SelectItem value="sydney">Sydney</SelectItem>
                      <SelectItem value="toronto">Toronto</SelectItem>
                      <SelectItem value="berlin">Berlin</SelectItem>
                      <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                      <SelectItem value="dublin">Dublin</SelectItem>
                      <SelectItem value="new-york">New York</SelectItem>
                      <SelectItem value="beijing">Beijing</SelectItem>
                      <SelectItem value="rome">Rome</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* University */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    University
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oxford">Oxford University</SelectItem>
                      <SelectItem value="harvard">
                        Harvard University
                      </SelectItem>
                      <SelectItem value="melbourne">
                        University of Melbourne
                      </SelectItem>
                      <SelectItem value="toronto-uni">
                        University of Toronto
                      </SelectItem>
                      <SelectItem value="ntu">
                        Nanyang Technological University
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Accommodation Type */}
                <div>
                  <Label
                    className="block text-sm font-medium mb-1"
                    htmlFor="accommodation-type"
                  >
                    Accommodation Type
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="accommodation-type"
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span>
                          {selectedAccommodation ??
                            "Select accommodation source"}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px]">
                      {accommodationTypes.map((type) => (
                        <div
                          key={type}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                          onClick={() => toggleAccommodation(type)}
                        >
                          <span>{type}</span>
                          <Checkbox
                            checked={selectedAccommodation === type}
                            onCheckedChange={() => toggleAccommodation(type)}
                          />
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Status */}
                <div>
                  <Label
                    className="text-sm font-medium"
                    htmlFor="student-status"
                  >
                    Status
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="student-status"
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span>{selectedStatus ?? "Select"}</span>
                        <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      {statuses.map((status) => (
                        <div
                          key={status}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                          onClick={() => toggleStatus(status)}
                        >
                          <span>{status}</span>
                          <Checkbox
                            checked={selectedStatus === status}
                            onCheckedChange={() => toggleStatus(status)}
                          />
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200 w-[40%]"
                  onClick={() => {
                    // handleClearFilters()
                  }}
                >
                  Clear Filters
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white w-[60%]"
                  onClick={() => {
                    // handleApplyFilters()
                    setOpen(false);
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* <Button className="bg-[#FCE7D2] hover:bg-[#f7dec6] text-red-600 px-4">
            Book Accomodation
          </Button> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#FCE7D2] hover:bg-[#f7dec6] text-red-600 px-4">
                Book Accommodation
              </Button>
            </DialogTrigger>

            <DialogContent
              className="!rounded-2xl  max-w-[350px] md:max-w-[600px] max-h-[350px] md:max-h-[400px] xl:max-h-[535px] overflow-y-scroll"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div>
                <h5 className="md:text-center">
                  Book Accommodation
                </h5>

                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Student Name</label>
                    <div className="relative">
                      <Input
                        placeholder="Search by Student Name or ID"
                        className="bg-gray-100 placeholder-[#313131] placeholder:text-sm pr-10"
                      />
                      <SearchIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Student ID</label>
                    <Input
                      placeholder="Enter student ID"
                      className="bg-gray-100 placeholder-[#313131] placeholder:text-sm pr-10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Application ID
                    </label>
                    <Input
                      placeholder="Enter application ID"
                      className="bg-gray-100 placeholder-[#313131] placeholder:text-sm pr-10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Country</label>
                    <Select>
                      <SelectTrigger className="bg-gray-100 placeholder-[#313131] placeholder:text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pakistan">Pakistan</SelectItem>
                        <SelectItem value="uk">UK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">University</label>
                    <Select>
                      <SelectTrigger className="bg-gray-100 placeholder-[#313131] placeholder:text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uni1">University 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">City</label>
                    <Select>
                      <SelectTrigger className="bg-gray-100 placeholder-[#313131] placeholder:text-sm">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lahore">Lahore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Accommodation Type
                    </label>
                    <Select>
                      <SelectTrigger className="bg-gray-100 placeholder-[#313131] placeholder:text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single_apartment">
                          Single Apartment
                        </SelectItem>
                        <SelectItem value="shared_apartment">
                          Shared Apartment
                        </SelectItem>
                        <SelectItem value="hostel">Hostel</SelectItem>
                        <SelectItem value="homestay">Homestays</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Accommodation Start Date
                    </label>
                    <Input
                      type="date"
                      className="bg-gray-100 placeholder-[#313131] placeholder:text-sm pr-10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Preferred Distance from Institution
                    </label>
                    <Select>
                      <SelectTrigger className="bg-gray-100 placeholder-[#313131] placeholder:text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="within_1_km">Within 1 Km</SelectItem>
                        <SelectItem value="1_to_5_km">1-5 Km</SelectItem>
                        <SelectItem value="5_to_10_km">5-10 Km</SelectItem>
                        <SelectItem value="no_preference">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Any Other Preference
                    </label>
                    <Input
                      placeholder="Write..."
                      className="bg-gray-100 placeholder-[#313131] placeholder:text-sm pr-10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Preferred Budget
                    </label>
                    <div className="flex flex-col gap-3">
                      <div>
                        <Select>
                          <SelectTrigger className="bg-gray-100 placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Currency:" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="usd">USD - US Dollar</SelectItem>
  <SelectItem value="pkr">PKR - Pakistani Rupee</SelectItem>
  <SelectItem value="eur">EUR - Euro</SelectItem>
  <SelectItem value="gbp">GBP - British Pound</SelectItem>
  <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
  <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
  <SelectItem value="nzd">NZD - New Zealand Dollar</SelectItem>
  <SelectItem value="inr">INR - Indian Rupee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-row gap-2">
                        {/* Max field */}
                        <div className="flex w-full bg-gray-100 rounded-md border">
                          <span className="flex items-center justify-center px-2 text-sm text-[#313131] whitespace-nowrap bg-gray-100 border-r border-black">
                            Max
                          </span>
                          <Input
                            placeholder="Write..."
                            className="bg-gray-100 placeholder-[#313131] placeholder:text-sm"
                          />
                        </div>

                        {/* Min field */}
                        <div className="flex w-full bg-gray-100 rounded-md">
                          <span className="flex items-center justify-center px-2 text-sm text-[#313131] whitespace-nowrap bg-gray-100  border-r border-black">
                            Min
                          </span>
                          <Input
                            placeholder="Write..."
                            className="bg-gray-100 placeholder-[#313131] placeholder:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Phone No.</label>

                    <div className="flex gap-2">
                      <Select
                        defaultValue={selectedValue}
                        onValueChange={(value) => setSelectedValue(value)}
                      >
                        <SelectTrigger className="w-[65%] rounded-md border bg-gray-100 placeholder-[#313131] placeholder:text-sm ">
                          <div className="flex items-center gap-2">
                            {selectedCountry && (
                              <>
                                <Image
                                  src={selectedCountry.flag}
                                  alt={selectedCountry.name}
                                  width={20}
                                  height={15}
                                  className="rounded-sm object-cover"
                                />
                                <span>{selectedCountry.code}</span>
                              </>
                            )}
                          </div>
                        </SelectTrigger>

                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={`${country.code}-${country.name}`}
                              value={`${country.code}-${country.name}`}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={country.flag}
                                  alt={country.name}
                                  width={20}
                                  height={15}
                                  className="rounded-sm object-cover"
                                />
                                <span>{country.code}</span>
                                <span>({country.name})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Enter your phone no"
                        className="bg-gray-100 placeholder-[#313131] placeholder:text-sm "
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      placeholder="Enter your email address"
                      className="bg-gray-100 placeholder-[#313131] placeholder:text-sm pr-10"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <Button className="bg-red-600 text-white hover:bg-red-700 w-[30%] mt-4 md:mt-0">
                    Submit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border overflow-hidden mt-8">
        {/* This wrapper enables scrolling when table overflows */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-2 text-left w-12 border-r border-gray-300">
                  Actions
                </th>
                <th className="px-4 py-2 text-left">Student Name</th>
                <th className="px-4 py-2 text-left">Student ID</th>
                <th className="px-4 py-2 text-left">Application ID</th>
                <th className="px-4 py-2 text-left">Country</th>
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-left">University</th>
                <th className="px-4 py-2 text-left">Accomodation Type</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-8 py-2 border-r border-gray-300">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <BsThreeDotsVertical className="cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="bottom"
                      className="ml-1 w-40"
                    >
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="flex items-center justify-between gap-2"
                      >
                        <span>Edit</span>
                        <Checkbox
                          checked={selected === "edit"}
                          onCheckedChange={() => handleSelect("edit")}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="flex items-center justify-between gap-2"
                      >
                        <span>Download</span>
                        <Checkbox
                          checked={selected === "download"}
                          onCheckedChange={() => handleSelect("download")}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="flex items-center justify-between gap-2"
                      >
                        <span>Delete</span>
                        <Checkbox
                          checked={selected === "delete"}
                          onCheckedChange={() => handleSelect("delete")}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                {Array.from({ length: 9 }).map((_, index) => (
                  <td key={index} className="px-4 py-4">
                    <Input className="h-8 bg-gray-100" />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccommodationBooking;
