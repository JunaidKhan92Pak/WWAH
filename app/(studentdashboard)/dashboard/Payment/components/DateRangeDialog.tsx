import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

function DataRangeDialog() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSelectingStart, setIsSelectingStart] = useState(true);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setIsSelectingStart(false);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  // Generate calendar data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDayClick = (day: number | null) => {
    if (day === null) return;

    const selectedDate = new Date(currentYear, currentMonth, day);
    const formattedDate = formatDate(selectedDate);

    if (isSelectingStart) {
      setStartDate(formattedDate);
      setIsSelectingStart(false);
    } else {
      const startDateTime = new Date(startDate).getTime();
      const selectedDateTime = selectedDate.getTime();

      if (selectedDateTime < startDateTime) {
        setStartDate(formattedDate);
        setEndDate("");
      } else {
        setEndDate(formattedDate);
        setIsSelectingStart(true);
      }
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
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

  const isDateInRange = (day: number) => {
    if (!startDate) return false;
    if (!endDate)
      return formatDate(new Date(currentYear, currentMonth, day)) === startDate;

    const currentDate = new Date(currentYear, currentMonth, day);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return currentDate >= start && currentDate <= end;
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setIsSelectingStart(true);
  };

  return (
    <div className="flex items-center justify-center bg-background">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 bg-[#FCE7D2] hover:bg-[#FCE7D2]"
          >
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-full sm:max-w-[800px] p-4">
          <DialogHeader>
            <DialogTitle>Select Date Range</DialogTitle>
          </DialogHeader>

          {/* Responsive layout: stack vertically on small screens */}
          {/* Responsive grid with scroll on small screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-h-[80vh] md:max-h-full overflow-y-auto md:overflow-visible">
            {/* Left: Inputs */}
            <div className="flex-1">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="start-date" className="text-sm font-medium">
                    Start Date
                  </label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="end-date" className="text-sm font-medium">
                    End Date
                  </label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="border-[#F0851D] text-[#F0851D]"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button type="submit" className="bg-red-700 text-white">
                  Apply
                </Button>
              </div>
            </div>

            {/* Right: Calendar */}
            <div className="lg:border-l lg:pl-8">
              <div className="w-full max-w-[300px] mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-md text-sm
                        ${day === null ? "" : "hover:bg-accent cursor-pointer"}
                        ${
                          isDateInRange(day as number)
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      `}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DataRangeDialog;
