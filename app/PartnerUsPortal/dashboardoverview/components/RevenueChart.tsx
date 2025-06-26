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
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", students: 0 },
  { month: "Feb", students: 50 },
  { month: "Mar", students: 90 },
  { month: "Apr", students: 120 },
  { month: "May", students: 160 },
  { month: "Jun", students: 200 },
  { month: "Jul", students: 250 },
  { month: "Aug", students: 220 },
  { month: "Sep", students: 180 },
  { month: "Oct", students: 130 },
  { month: "Nov", students: 70 },
  { month: "Dec", students: 30 },
];
const intakeYears = ["2025", "2026", "2027"];
const currencyOptions = ["USD", "EUR", "GBP", "PKR", "INR", "AUD"];

const exportOptions = [
  "Export CSV Data",
  "Download PNG image",
  "Download JPEG image",
  "Download PDF document",
  "Export as SVG",
];

const RevenueChart = () => {
  const [open, setOpen] = useState(false);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const toggleYear = (year: string) => {
    setSelectedYear((prev) => (prev === year ? null : year));
  };

  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  const toggleCurrency = (currency: string) => {
    setSelectedCurrency((prev) => (prev === currency ? null : currency));
  };

  return (
     <div className="flex flex-col items-center justify-center text-center border rounded-2xl">
          <div className="flex flex-col gap-2 items-start w-full pl-4 pt-2">
            <h5>Revenue Generated</h5>
            <div className="flex items-center gap-2 w-full mb-4">
              {/* <Button
                         size="sm"
                         className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-10"
                       >
                         <Image
                           src="/partnersportal/Filter.svg" // Replace with your image path
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
                  className="!rounded-2xl  max-w-[350px] md:max-w-[450px] max-h-[350px] md:max-h-[300px] xl:max-h-[310px] overflow-y-scroll"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <DialogHeader>
                    <DialogTitle className="mb-2 text-start">
                      Filter Revenue by
                    </DialogTitle>
                    <div className="w-full h-px bg-gray-300" />
                  </DialogHeader>

                  <div className="space-y-2">
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

                    {/* Currency */}
                    <div>
                      <Label className="text-sm font-medium" htmlFor="currency">
                        Currency
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="currency"
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <span>{selectedCurrency ?? "Select"}</span>
                            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                          {currencyOptions.map((option) => (
                            <div
                              key={option}
                              className="flex items-center justify-between rounded px-3 py-2 hover:bg-muted-foreground/10 cursor-pointer"
                              onClick={() => toggleCurrency(option)}
                            >
                              <span>{option}</span>
                              <Checkbox
                                checked={selectedCurrency === option}
                                onCheckedChange={() => toggleCurrency(option)}
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
              {/* <Button
                         size="sm"
                         className="bg-white border hover:bg-gray-100"
                       >
                         <Image
                           src="/partnersportal/dots.svg" // Replace with the correct image path
                           alt="More"
                           width={4}
                           height={4}
                         />
                       </Button> */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-white border hover:bg-gray-100"
                  >
                    <Image
                      src="/partnersportal/dots.svg"
                      alt="More"
                      width={4}
                      height={4}
                    />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-2 w-56 rounded-xl space-y-2">
                  {exportOptions.map((option, index) => (
                    <div
                      key={index}
                      className="text-sm cursor-pointer hover:bg-muted rounded px-3 py-2"
                      onClick={() => alert(option)} // Replace with actual export function
                    >
                      {option}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <p className="text-center font-semibold">
            Revenue Generated Over Months
          </p>
          <div className="block md:hidden h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ left: 5, top: 20, right: 10, bottom: 20 }}
              >
                <CartesianGrid stroke="#ccc" />
                <XAxis
                  dataKey="month"
                  interval={0}
                  tick={{ fontSize: 9 }}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis interval={0} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#8884d8" />
                <text
                  x={20}
                  y={100}
                  textAnchor="middle"
                  fill="#666"
                  transform="rotate(-90 20 100)"
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    fill: "black",
                  }}
                >
                  Revenue Generated (Dollars)
                </text>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* md+ screens: original height and default ticks */}
          <div className="hidden md:block h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ left: 5, top: 20, right: 10, bottom: 20 }}
              >
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#8884d8" />
                <text
                  x={20}
                  y={150}
                  textAnchor="middle"
                  fill="#666"
                  transform="rotate(-90 20 150)"
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    fill: "black",
                  }}
                >
                  Revenue Generated (Dollars)
                </text>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  );
};

export default RevenueChart;
