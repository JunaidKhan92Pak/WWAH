"use client"
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
export default function StudentsTable() {
   const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.focus();
  };

    const [open, setOpen] = useState(false)


   const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const statuses = ["New Students", "Ready to Apply",
     "Application Submitted", "Application Approved", 
     "Paid Application","Ready for Visa", "Enrolled"];

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? null : status));
  };
  return (
    <div className="p-6 rounded-lg border bg-white  min-h-[460px]">
              <h4>Students</h4>

      <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center mt-2 mb-4 gap-4">
                 <div className="flex flex-col">

             <div className="relative w-50 md:w-72">
      <FiSearch
        onClick={handleIconClick}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
      />
      <Input
        ref={inputRef}
        placeholder="Search by Name, student ID, Email"
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
        <Image src="/partnersportal/Filter.svg" alt="Filters" width={15} height={15} />
        Filters
      </Button>
                      </DialogTrigger>
 <DialogContent
                  className="!rounded-2xl  max-w-[350px] md:max-w-[450px] max-h-[350px] md:max-h-[400px] xl:max-h-[510px] overflow-y-scroll"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
          <DialogHeader>
            <DialogTitle>Filter Students by</DialogTitle>
          </DialogHeader>

          {/* Filter Fields */}
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Country</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
               <SelectContent>
  <SelectItem value="united-kingdom">United Kingdom</SelectItem>
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

            <div>
              <label className="block text-sm font-medium mb-1">Degree Level</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelors">Bachelors</SelectItem>
                  <SelectItem value="masters">Masters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Field of Study</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Referral Source</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
      <Label className="text-sm font-medium" htmlFor="student-status">
        Student Status
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
                setOpen(false)
              }}
            >
              Apply Filters
            </Button>
          </div>

            </DialogContent>
      </Dialog>

               <Button
          className="bg-[#FCE7D2] hover:bg-[#f7dec6] text-red-600 px-4"

        >
          + Add New Student
        </Button>
        </div>
      </div>

<div className=" border overflow-hidden">
  {/* This wrapper enables scrolling when table overflows */}
  <div className="w-full overflow-x-auto">
    <table className="min-w-[1200px] w-full text-sm">
      <thead className="border-b">
        <tr>
          <th className="px-4 py-2 text-left w-12 border-r border-gray-300">Actions</th>
          <th className="px-4 py-2 text-left">Student ID</th>
          <th className="px-4 py-2 text-left">Student Name</th>
          <th className="px-4 py-2 text-left">Email Address</th>
          <th className="px-4 py-2 text-left">Preferred Country</th>
          <th className="px-4 py-2 text-left">Degree Level</th>
          <th className="px-4 py-2 text-left">Field of Study</th>
          <th className="px-4 py-2 text-left">Referral Source</th>
          <th className="px-4 py-2 text-left">Student Status</th>
          
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">

<td className="px-8 py-2 border-r border-gray-300">
         <DropdownMenu>
  <DropdownMenuTrigger asChild>
      <BsThreeDotsVertical />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" side="bottom" className="ml-1">
    <DropdownMenuItem>Edit Student</DropdownMenuItem>
    <DropdownMenuItem>Create Application</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

          </td>
          {Array.from({ length: 8 }).map((_, index) => (
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
}
