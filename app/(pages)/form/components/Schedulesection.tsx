"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ScheduleTable = () => {
  return (
    <div className="w-full mx-auto py-4 md:py-14">
       {/* Centered Heading */}
       <h4 className="text-center text-gray-800 w-[60%] mx-auto leading-5 md:leading-8">
       Timing & Fee Schedule for IELTS/PTE/TOEFL Preparation!
      </h4>
      <div className="bg-white shadow-md rounded-3xl overflow-hidden p-1  md:p-2 lg:p-6 w-full md:w-[95%] xl:w-[90%] mx-auto">
        {/* Table Header with rounded top corners */}
        <div className="overflow-hidden rounded-xl">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="bg-[#F4D0D2]">
                <TableHead className="text-start p-1 2xl:p-5 md:text-center w-1/5 text-black 2xl:text-xl">Days</TableHead>
                <TableHead className="text-start p-1  2xl:p-5 md:text-center w-1/5 text-black 2xl:text-xl">Timings</TableHead>
                <TableHead className="text-start p-1 2xl:p-5 md:text-center w-1/5 text-black 2xl:text-xl">Class Duration</TableHead>
                <TableHead className="text-start p-1 2xl:p-5 md:text-center w-1/5 text-black 2xl:text-xl">Course Duration</TableHead>
                <TableHead className="text-start p-1 2xl:p-5 md:text-center w-1/5 text-black 2xl:text-xl">Fees</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Table Body with rounded bottom corners */}
        <div className="overflow-hidden rounded-2xl mt-4">
          <Table className="table-fixed w-full">
            <TableBody className="bg-[#f3dac2]">
              {/* Row 1 */}
              <TableRow>
                <TableCell className="text-start p-1 2xl:p-16 md:text-center 2xl:text-xl">Monday to Friday</TableCell>
                <TableCell className="text-start p-1 lg:p-5 md:text-center border-l">
                  <p className="text-gray-700 2xl:text-xl">11:00am to 1:00pm</p>
                  <hr className="border-t border-gray-300 my-1" />
                  <p className="text-gray-700 2xl:text-xl">2:00pm to 4:00pm</p>
                  <hr className="border-t border-gray-300 my-1" />
                  <p className="text-gray-700 2xl:text-xl">5:00pm to 7:00pm</p>
                </TableCell>
                <TableCell className="text-gray-700 text-start p-1 md:text-center border-l 2xl:text-xl">2 Hours</TableCell>
                <TableCell className="text-gray-700 text-start p-1 md:text-center border-l 2xl:text-xl">2 Weeks</TableCell>
                <TableCell className="text-gray-700 text-start  p-0 xl:p-4 md:text-center border-l 2xl:text-xl">Rs. 10,000/-(no discount in particular)
        
                </TableCell>
              </TableRow>

              {/* Row 2 */}
              <TableRow>
                <TableCell className="text-start p-1 2xl:p-16 md:text-center 2xl:text-xl">Monday to Friday</TableCell>
                <TableCell className="text-start p-1 lg:p-5 md:text-center border-l">
                  <p className="text-gray-700 2xl:text-xl">11:00am to 1:00pm</p>
                  <hr className="border-t border-gray-300 my-1" />
                  <p className="text-gray-700 2xl:text-xl">2:00pm to 4:00pm</p>
                  <hr className="border-t border-gray-300 my-1" />
                  <p className="text-gray-700 2xl:text-xl">5:00pm to 7:00pm</p>
                </TableCell>
                <TableCell className="text-gray-700 text-start p-1 md:text-center border-l 2xl:text-xl">2 Hours</TableCell>
                <TableCell className="text-gray-700 text-start p-1 md:text-center border-l 2xl:text-xl">4 Weeks</TableCell>
                <TableCell className="text-gray-700 text-start p-1 md:text-center border-l 2xl:text-xl">Rs. 17,000/-</TableCell>
              </TableRow>

              {/* Row 3 */}
              <TableRow>
                <TableCell className="text-start  p-1 2xl:p-16 md:text-center 2xl:text-xl">Monday to Friday</TableCell>
                <TableCell className="text-start p-1 lg:p-5 md:text-center border-l">
                  <p className="text-gray-700 2xl:text-xl">11:00am to 1:00pm</p>
                  <hr className="border-t border-gray-300 my-1" />
                  <p className="text-gray-700 2xl:text-xl">2:00pm to 4:00pm</p>
                  <hr className="border-t border-gray-300 my-1" />
                  <p className="text-gray-700 2xl:text-xl">5:00pm to 7:00pm</p>
                </TableCell>
                <TableCell className="text-gray-700 text-start p-1 md:text-center border-l 2xl:text-xl">2 Hours</TableCell>
                <TableCell className="text-gray-700 text-start p-1 md:text-center border-l 2xl:text-xl">8 Weeks</TableCell>
                <TableCell className="text-gray-700 text-start p-1 md:text-center border-l 2xl:text-xl">Rs. 25,000/-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTable;
