"use client";



import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DataRangeDialog from "./components/DateRangeDialog";

// Define the transaction status type
type Status = "pending" | "approved";

// Define the transaction interface
interface Transaction {
  id: string;
  name: string;
  amount: string;
  status: Status;
}

// transaction data
const transactions: Transaction[] = Array.from({ length: 15 }, (_, i) => ({
  id: `#25642${i}5554${i}`,
  name: "New York Hostel Accom...",
  amount: "$ 550.00 USD",
  status: ["pending", "approved"][
    Math.floor(Math.random() * 2)
  ] as Status,
}));

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-600";
      case "approved":
        return "bg-green-100 text-green-600";
     
    }
  };

  return (
    <div className="px-4  ml-auto  rounded-lg ">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-base sm:text-lg">Payment Tracker & History!</h4>
          <p className="text-sm hidden sm:block">Showing data history of current month.</p>
        </div>
        {/* <Button variant="outline" className="text-black px-4 border-orange-200 bg-orange-50 hover:bg-orange-100">
          <Image src="/paymentStudentDashboard/data-range.svg" alt="data" width={20} height={20} />
          Date range
        </Button> */}
        <div className=" bg-gray-100 flex items-center justify-center">
        <DataRangeDialog/>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 text-black">
              <TableHead>Transaction Name</TableHead>
              <TableHead className="hidden md:table-cell"  >Transaction ID</TableHead>
              <TableHead className="hidden md:table-cell">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((transaction) => (
              <TableRow  key={transaction.id}>
                <TableCell>{transaction.name}</TableCell>
                <TableCell className="font-mono hidden md:table-cell ">{transaction.id}</TableCell>
                <TableCell className="hidden md:table-cell">{transaction.amount}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center px-3 justify-center gap-2 w-full h-9 sm:w-4/5 lg:w-2/3 rounded-lg ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    <span className="capitalize">{transaction.status}</span>
                    <span className="text-4xl pb-1">•</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from(
              { length: Math.ceil(transactions.length / itemsPerPage) },
              (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(
                      Math.ceil(transactions.length / itemsPerPage),
                      p + 1
                    )
                  )
                }
                className={
                  currentPage === Math.ceil(transactions.length / itemsPerPage)
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
