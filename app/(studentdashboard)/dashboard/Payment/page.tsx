// "use client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import DataRangeDialog from "./components/DateRangeDialog";

// // Define the transaction status type
// type Status = "pending" | "approved";

// // Define the transaction interface
// interface Transaction {
//   id: string;
//   name: string;
//   amount: string;
//   status: Status;
// }

// // transaction data
// const transactions: Transaction[] = Array.from({ length: 15 }, (_, i) => ({
//   id: `#25642${i}5554${i}`,
//   name: "New York Hostel Accom...",
//   amount: "$ 550.00 USD",
//   status: ["pending", "approved"][
//     Math.floor(Math.random() * 2)
//   ] as Status,
// }));

// export default function Home() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   // Calculate pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

//   const getStatusColor = (status: Status) => {
//     switch (status) {
//       case "pending":
//         return "bg-orange-100 text-orange-600";
//       case "approved":
//         return "bg-green-100 text-green-600";

//     }
//   };

//   return (
//     <div className="px-4  ml-auto  rounded-lg ">
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <h4 className="text-base sm:text-lg">Payment Tracker & History!</h4>
//           <p className="text-sm hidden sm:block">Showing data history of current month.</p>
//         </div>
//         <div className=" bg-gray-100 flex items-center justify-center">
//         <DataRangeDialog/>
//         </div>
//       </div>
//  <div className="relative">
//       {/* Blur Overlay */}
//       {/* <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/70 rounded-lg flex items-center justify-center">
//         <Button className="bg-[#C7161E] hover:bg-[#f03c45] text-white font-medium py-2 px-8 rounded-full transition-colors duration-300 shadow-lg">
//           No History
//         </Button>
//       </div> */}
//       <div className="border rounded-lg">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-100 text-black">
//               <TableHead>Transaction Name</TableHead>
//               <TableHead className="hidden md:table-cell"  >Transaction ID</TableHead>
//               <TableHead className="hidden md:table-cell">Amount</TableHead>
//               <TableHead>Status</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {currentItems.map((transaction) => (
//               <TableRow  key={transaction.id}>
//                 <TableCell>{transaction.name}</TableCell>
//                 <TableCell className="font-mono hidden md:table-cell ">{transaction.id}</TableCell>
//                 <TableCell className="hidden md:table-cell">{transaction.amount}</TableCell>
//                 <TableCell>
//                   <div
//                     className={`inline-flex items-center px-3 justify-center gap-2 w-full h-9 sm:w-4/5 lg:w-2/3 rounded-lg ${getStatusColor(
//                       transaction.status
//                     )}`}
//                   >
//                     <span className="capitalize">{transaction.status}</span>
//                     {/* <span className="capitalize">--</span> */}
//                     <span className="text-4xl pb-1">•</span>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="mt-4">
//         <Pagination>
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 className={
//                   currentPage === 1 ? "pointer-events-none opacity-50" : ""
//                 }
//               />
//             </PaginationItem>
//             {Array.from(
//               { length: Math.ceil(transactions.length / itemsPerPage) },
//               (_, i) => (
//                 <PaginationItem key={i + 1}>
//                   <PaginationLink
//                     onClick={() => setCurrentPage(i + 1)}
//                     isActive={currentPage === i + 1}
//                   >
//                     {i + 1}
//                   </PaginationLink>
//                 </PaginationItem>
//               )
//             )}
//             <PaginationItem>
//               <PaginationNext
//                 onClick={() =>
//                   setCurrentPage((p) =>
//                     Math.min(
//                       Math.ceil(transactions.length / itemsPerPage),
//                       p + 1
//                     )
//                   )
//                 }
//                 className={
//                   currentPage === Math.ceil(transactions.length / itemsPerPage)
//                     ? "pointer-events-none opacity-50"
//                     : ""
//                 }
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       </div>
//       </div>
//     </div>
//   );
// }

"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DataRangeDialog from "./components/DateRangeDialog";
import { getAuthToken } from "@/utils/authHelper";

// Define the transaction status type
type Status = "pending" | "approved";

// Define the transaction interface
interface Transaction {
  _id: string;
  transactionName: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const token = getAuthToken(); // Adjust based on how you store auth token

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/adminControls/getPaymentStats`,
          {
            // Adjust API endpoint
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Payments fetched:", result);
        if (result.success) {
          // If your API returns a single payment, wrap it in an array
          // If it returns multiple payments, use result.data directly
          const paymentsData = Array.isArray(result.data)
            ? result.data
            : [result.data];
          setTransactions(paymentsData);
        } else {
          setError(result.message || "Failed to fetch payments");
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

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
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return `$ ${amount.toFixed(2)} ${currency}`;
  };

  if (loading) {
    return (
      <div className="px-4 ml-auto rounded-lg">
        <div className="flex justify-center items-center h-40">
          <div className="text-lg">Loading payments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 ml-auto rounded-lg">
        <div className="flex justify-center items-center h-40">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 ml-auto rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-base sm:text-lg">Payment Tracker & History!</h4>
          <p className="text-sm hidden sm:block">
            Showing data history of current month.
          </p>
        </div>
        <div className="bg-gray-100 flex items-center justify-center">
          <DataRangeDialog />
        </div>
      </div>

      <div className="relative">
        {/* Show "No History" overlay if no transactions */}
        {transactions.length === 0 ? (
          <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/70 rounded-lg flex items-center justify-center">
            <Button className="bg-[#C7161E] hover:bg-[#f03c45] text-white font-medium py-2 px-8 rounded-full transition-colors duration-300 shadow-lg">
              No History
            </Button>
          </div>
        ) : null}

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 text-black">
                <TableHead>Transaction Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Transaction ID
                </TableHead>
                <TableHead className="hidden md:table-cell">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.transactionName}</TableCell>
                  <TableCell className="font-mono hidden md:table-cell">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </TableCell>
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

        {transactions.length > 0 && (
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
                      currentPage ===
                      Math.ceil(transactions.length / itemsPerPage)
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
