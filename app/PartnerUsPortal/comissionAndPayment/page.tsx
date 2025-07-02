"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Edit, Trash2, Plus} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface CommissionData {
  id: string;
  studentName: string;
  studentId: string;
  applicationId: string;
  studyDestination: string;
  universityName: string;
  courseName: string;
  commissionAmount: number;
  commissionStatus: 'Pending' | 'Processing' | 'Paid' | 'Cancelled';
  paymentDate: string;
  receipt: string;
}

interface PaymentData {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  applicationId: string;
  purposeOfPayment: string;
  paymentMethod: string;
  paymentDate: string;
  paidAmount: number;
  status: 'Pending' | 'Under Review' | 'Paid' | 'Failed';
}

const mockCommissionData: CommissionData[] = [
  {
    id: '1',
    studentName: 'John Smith',
    studentId: 'ST001',
    applicationId: 'APP001',
    studyDestination: 'UK',
    universityName: 'University of Oxford',
    courseName: 'Computer Science',
    commissionAmount: 2500,
    commissionStatus: 'Paid',
    paymentDate: '2024-01-15',
    receipt: 'REC001'
  },
  {
    id: '2',
    studentName: 'Emma Johnson',
    studentId: 'ST002',
    applicationId: 'APP002',
    studyDestination: 'USA',
    universityName: 'Harvard University',
    courseName: 'Business Administration',
    commissionAmount: 3000,
    commissionStatus: 'Processing',
    paymentDate: '2024-01-20',
    receipt: 'REC002'
  },
  {
    id: '3',
    studentName: 'Michael Brown',
    studentId: 'ST003',
    applicationId: 'APP003',
    studyDestination: 'Canada',
    universityName: 'University of Toronto',
    courseName: 'Engineering',
    commissionAmount: 2200,
    commissionStatus: 'Pending',
    paymentDate: '2024-01-25',
    receipt: 'REC003'
  },
  {
    id: '4',
    studentName: 'Sarah Davis',
    studentId: 'ST004',
    applicationId: 'APP004',
    studyDestination: 'Australia',
    universityName: 'University of Sydney',
    courseName: 'Medicine',
    commissionAmount: 3500,
    commissionStatus: 'Paid',
    paymentDate: '2024-01-18',
    receipt: 'REC004'
  },
  {
    id: '5',
    studentName: 'David Wilson',
    studentId: 'ST005',
    applicationId: 'APP005',
    studyDestination: 'UK',
    universityName: 'Imperial College London',
    courseName: 'Physics',
    commissionAmount: 2800,
    commissionStatus: 'Cancelled',
    paymentDate: '2024-01-22',
    receipt: 'REC005'
  }
];

const mockPaymentData: PaymentData[] = [
  {
    id: '1',
    transactionId: 'TXN001',
    studentName: 'John Smith',
    studentId: 'ST001',
    applicationId: 'APP001',
    purposeOfPayment: 'Application Fee',
    paymentMethod: 'Credit/Debit Card',
    paymentDate: '2024-01-15',
    paidAmount: 500,
    status: 'Paid'
  },
  {
    id: '2',
    transactionId: 'TXN002',
    studentName: 'Emma Johnson',
    studentId: 'ST002',
    applicationId: 'APP002',
    purposeOfPayment: 'Tuition Deposit',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2024-01-20',
    paidAmount: 2000,
    status: 'Under Review'
  },
  {
    id: '3',
    transactionId: 'TXN003',
    studentName: 'Michael Brown',
    studentId: 'ST003',
    applicationId: 'APP003',
    purposeOfPayment: 'Accommodation Booking Fee',
    paymentMethod: 'Airport Pickup Fee',
    paymentDate: '2024-01-25',
    paidAmount: 300,
    status: 'Pending'
  }
];

export default function CommissionsPayments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    studyDestination: '',
    university: '',
    commissionStatus: '',
    paymentDate: ''
  });
  const [paymentFilters, setPaymentFilters] = useState({
    purposeOfPayment: '',
    paymentMethod: '',
    paymentDate: '',
    paidAmount: [0, 5000],
    paymentStatus: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPaymentButtonOpen, setIsPaymentButtonOpen] = useState(false);
  const [isPaymentFilterOpen, setIsPaymentFilterOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    studentName: '',
    studentId: '',
    applicationId: '',
    university: '',
    courseName: '',
    purposeOfPayment: '',
    amountToBePaid: '',
    paymentCode: '',
    paymentMethod: '',
    lastTransactionReceipt: null
  });
  
  const itemsPerPage = 10;

  const filteredCommissionData = useMemo(() => {
    return mockCommissionData.filter(item => {
      const matchesSearch = 
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDestination = !filters.studyDestination || item.studyDestination === filters.studyDestination;
      const matchesUniversity = !filters.university || item.universityName.toLowerCase().includes(filters.university.toLowerCase());
      const matchesStatus = !filters.commissionStatus || item.commissionStatus === filters.commissionStatus;
      
      return matchesSearch && matchesDestination && matchesUniversity && matchesStatus;
    });
  }, [searchTerm, filters]);

  const filteredPaymentData = useMemo(() => {
    return mockPaymentData.filter(item => {
      const matchesSearch = 
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPurpose = !paymentFilters.purposeOfPayment || item.purposeOfPayment === paymentFilters.purposeOfPayment;
      const matchesMethod = !paymentFilters.paymentMethod || item.paymentMethod === paymentFilters.paymentMethod;
      const matchesStatus = !paymentFilters.paymentStatus || item.status === paymentFilters.paymentStatus;
      const matchesAmount = item.paidAmount >= paymentFilters.paidAmount[0] && item.paidAmount <= paymentFilters.paidAmount[1];
      
      return matchesSearch && matchesPurpose && matchesMethod && matchesStatus && matchesAmount;
    });
  }, [searchTerm, paymentFilters]);

  const paginatedCommissionData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCommissionData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCommissionData, currentPage]);

  const paginatedPaymentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPaymentData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPaymentData, currentPage]);

  const totalCommissionPages = Math.ceil(filteredCommissionData.length / itemsPerPage);
  const totalPaymentPages = Math.ceil(filteredPaymentData.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    const variants = {
      Paid: 'bg-green-100 text-green-800 hover:bg-green-200',
      Processing: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      Cancelled: 'bg-red-100 text-red-800 hover:bg-red-200',
      'Under Review': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      Failed: 'bg-red-100 text-red-800 hover:bg-red-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const handleFilterReset = () => {
    setFilters({
      studyDestination: '',
      university: '',
      commissionStatus: '',
      paymentDate: ''
    });
  };

  const handlePaymentFilterReset = () => {
    setPaymentFilters({
      purposeOfPayment: '',
      paymentMethod: '',
      paymentDate: '',
      paidAmount: [0, 5000],
      paymentStatus: ''
    });
  };

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    setIsExportOpen(false);
  };

  const handleDownloadReceipt = (receiptId: string) => {
    console.log(`Downloading receipt: ${receiptId}`);
    // Implementation for downloading receipt
  };

  const handlePaymentSubmit = () => {
    console.log('Payment form submitted:', paymentForm);
    setIsPaymentButtonOpen(false);
    // Reset form
    setPaymentForm({
      studentName: '',
      studentId: '',
      applicationId: '',
      university: '',
      courseName: '',
      purposeOfPayment: '',
      amountToBePaid: '',
      paymentCode: '',
      paymentMethod: '',
      lastTransactionReceipt: null
    });
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Commissions & Payments
          </h1>
          <p className="text-gray-600">
            Manage and track commission payments for student applications
          </p>
        </div>

        <Tabs defaultValue="commission-overview" className="space-y-6">
          <TabsList>
            <TabsTrigger
              value="commission-overview"
              className="px-6 py-2 text-sm font-semibold sm:text-base rounded-t-xl rounded-b-none bg-transparent text-black hover:bg-transparent data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Commission Overview
            </TabsTrigger>
            <TabsTrigger
              value="payments-mode"
              className="px-6 py-2 text-sm font-semibold sm:text-base rounded-t-xl rounded-b-none bg-transparent text-black hover:bg-transparent data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Payments Made
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commission-overview" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-white">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by Student Name or ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
className="pl-8 md:pl-10 py-2 w-full border border-gray-300 focus:border-black focus:ring-black placeholder-gray-500 placeholder:text-sm"

/>
                  </div>

                  <div className="flex gap-3">
                    <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-10">
                          <Filter className="mr-2 h-4 w-4" />
                          Filters
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            Filter Commissions & Payments by
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="study-destination">
                              Study Destination
                            </Label>
                            <Select
                              value={filters.studyDestination}
                              onValueChange={(value) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  studyDestination: value,
                                }))
                              }
                            >
                              <SelectTrigger id="study-destination">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UK">UK</SelectItem>
                                <SelectItem value="USA">USA</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="Australia">
                                  Australia
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="university">University</Label>
                            <Select
                              value={filters.university}
                              onValueChange={(value) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  university: value,
                                }))
                              }
                            >
                              <SelectTrigger id="university">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="oxford">
                                  University of Oxford
                                </SelectItem>
                                <SelectItem value="harvard">
                                  Harvard University
                                </SelectItem>
                                <SelectItem value="toronto">
                                  University of Toronto
                                </SelectItem>
                                <SelectItem value="sydney">
                                  University of Sydney
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="commission-status">
                              Commission Status
                            </Label>
                            <Select
                              value={filters.commissionStatus}
                              onValueChange={(value) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  commissionStatus: value,
                                }))
                              }
                            >
                              <SelectTrigger id="commission-status">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">
                                  Processing
                                </SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Cancelled">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-date">Payment Date</Label>
                            <Input
                              id="payment-date"
                              type="date"
                              value={filters.paymentDate}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  paymentDate: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <Button variant="outline" onClick={handleFilterReset}>
                            Clear Filters
                          </Button>
                          <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => setIsFilterOpen(false)}
                          >
                            Apply Filters
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#FCE7D2] hover:bg-[#FCE7D2] text-[#D8070A] h-10">
                          <Download className="mr-2 h-4 w-4" />
                          Export Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Export Report</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 py-4">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleExport("CSV")}
                          >
                            Export CSV Data
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleExport("PNG")}
                          >
                            Download PNG Image
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleExport("JPEG")}
                          >
                            Download JPEG Image
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleExport("PDF")}
                          >
                            Download PDF document
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleExport("SVG")}
                          >
                            Export as SVG
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12">Actions</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Study Destination</TableHead>
                        <TableHead>University Name</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Commission Amount</TableHead>
                        <TableHead>Commission Status</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCommissionData.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50">
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-medium">
                            {row.studentName}
                          </TableCell>
                          <TableCell>{row.studentId}</TableCell>
                          <TableCell>{row.applicationId}</TableCell>
                          <TableCell>{row.studyDestination}</TableCell>
                          <TableCell>{row.universityName}</TableCell>
                          <TableCell>{row.courseName}</TableCell>
                          <TableCell className="font-semibold">
                            ${row.commissionAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(row.commissionStatus)}
                          </TableCell>
                          <TableCell>
                            {new Date(row.paymentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadReceipt(row.receipt)}
                              className="h-8"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredCommissionData.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>No data found matching your criteria</p>
                  </div>
                )}

                {totalCommissionPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
                    <p className="text-sm text-gray-700">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredCommissionData.length
                      )}{" "}
                      of {filteredCommissionData.length} results
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalCommissionPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalCommissionPages)
                          )
                        }
                        disabled={currentPage === totalCommissionPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments-mode" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-white">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by Student Name or ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
className="pl-8 md:pl-10 py-2 w-full border border-gray-300 focus:border-black focus:ring-black placeholder-gray-500 placeholder:text-sm"

/>
                  </div>

                  <div className="flex gap-3">
                    <Dialog
                      open={isPaymentFilterOpen}
                      onOpenChange={setIsPaymentFilterOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-10">
                          <Filter className="mr-2 h-4 w-4" />
                          Filters
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            Filter Commissions & Payments by
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Purpose of Payment</Label>
                            <Select
                              value={paymentFilters.purposeOfPayment}
                              onValueChange={(value) =>
                                setPaymentFilters((prev) => ({
                                  ...prev,
                                  purposeOfPayment: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Application Fee">
                                  Application Fee
                                </SelectItem>
                                <SelectItem value="Tuition Deposit">
                                  Tuition Deposit
                                </SelectItem>
                                <SelectItem value="Accommodation Booking Fee">
                                  Accommodation Booking Fee
                                </SelectItem>
                                <SelectItem value="Airport Pickup Fee">
                                  Airport Pickup Fee
                                </SelectItem>
                                <SelectItem value="Others">Others</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Payment Methods</Label>
                            <Select
                              value={paymentFilters.paymentMethod}
                              onValueChange={(value) =>
                                setPaymentFilters((prev) => ({
                                  ...prev,
                                  paymentMethod: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Credit/Debit Card">
                                  Credit/Debit Card
                                </SelectItem>
                                <SelectItem value="Bank Transfer">
                                  Bank Transfer
                                </SelectItem>
                                <SelectItem value="Wire Transfer">
                                  Wire Transfer
                                </SelectItem>
                                <SelectItem value="Airport Pickup Fee">
                                  Airport Pickup Fee
                                </SelectItem>
                                <SelectItem value="Others">Others</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Payment Date</Label>
                            <Input
                              type="date"
                              value={paymentFilters.paymentDate}
                              onChange={(e) =>
                                setPaymentFilters((prev) => ({
                                  ...prev,
                                  paymentDate: e.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Paid Amount</Label>
                            <div className="px-3">
                              <Slider
                                value={paymentFilters.paidAmount}
                                onValueChange={(value) =>
                                  setPaymentFilters((prev) => ({
                                    ...prev,
                                    paidAmount: value,
                                  }))
                                }
                                max={5000}
                                min={0}
                                step={100}
                                className="w-full"
                              />
                              <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>${paymentFilters.paidAmount[0]}</span>
                                <span>${paymentFilters.paidAmount[1]}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label>Payment Status</Label>
                            <div className="space-y-2">
                              {[
                                "Pending",
                                "Under Review",
                                "Paid",
                                "Failed",
                              ].map((status) => (
                                <div
                                  key={status}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={status}
                                    checked={
                                      paymentFilters.paymentStatus === status
                                    }
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setPaymentFilters((prev) => ({
                                          ...prev,
                                          paymentStatus: status,
                                        }));
                                      } else {
                                        setPaymentFilters((prev) => ({
                                          ...prev,
                                          paymentStatus: "",
                                        }));
                                      }
                                    }}
                                  />
                                  <Label
                                    htmlFor={status}
                                    className="text-sm font-normal"
                                  >
                                    {status}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={handlePaymentFilterReset}
                          >
                            Clear Filters
                          </Button>
                          <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => setIsPaymentFilterOpen(false)}
                          >
                            Apply Filters
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={isPaymentButtonOpen}
                      onOpenChange={setIsPaymentButtonOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-[#FCE7D2] hover:bg-[#FCE7D2] text-[#D8070A] h-10">
                          Payment Button
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Payment Button</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Student Name</Label>
                                <div className="relative">
                                  <Input
                                    placeholder="Search the Student Name or ID"
                                    value={paymentForm.studentName}
                                    onChange={(e) =>
                                      setPaymentForm((prev) => ({
                                        ...prev,
                                        studentName: e.target.value,
                                      }))
                                    }
                                  />
                                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Student ID</Label>
                                <Input
                                  value={paymentForm.studentId}
                                  onChange={(e) =>
                                    setPaymentForm((prev) => ({
                                      ...prev,
                                      studentId: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Application ID</Label>
                                <Input
                                  value={paymentForm.applicationId}
                                  onChange={(e) =>
                                    setPaymentForm((prev) => ({
                                      ...prev,
                                      applicationId: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>University</Label>
                                <Select
                                  value={paymentForm.university}
                                  onValueChange={(value) =>
                                    setPaymentForm((prev) => ({
                                      ...prev,
                                      university: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="oxford">
                                      University of Oxford
                                    </SelectItem>
                                    <SelectItem value="harvard">
                                      Harvard University
                                    </SelectItem>
                                    <SelectItem value="toronto">
                                      University of Toronto
                                    </SelectItem>
                                    <SelectItem value="sydney">
                                      University of Sydney
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Course Name</Label>
                                <Input
                                  placeholder="Write"
                                  value={paymentForm.courseName}
                                  onChange={(e) =>
                                    setPaymentForm((prev) => ({
                                      ...prev,
                                      courseName: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Purpose of Payment</Label>
                                <Select
                                  value={paymentForm.purposeOfPayment}
                                  onValueChange={(value) =>
                                    setPaymentForm((prev) => ({
                                      ...prev,
                                      purposeOfPayment: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="application-fee">
                                      Application Fee
                                    </SelectItem>
                                    <SelectItem value="tuition-deposit">
                                      Tuition Deposit
                                    </SelectItem>
                                    <SelectItem value="accommodation">
                                      Accommodation Booking Fee
                                    </SelectItem>
                                    <SelectItem value="airport-pickup">
                                      Airport Pickup Fee
                                    </SelectItem>
                                    <SelectItem value="others">
                                      Others
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Amount to be paid</Label>
                                <Input
                                  placeholder="Enter Amount"
                                  value={paymentForm.amountToBePaid}
                                  onChange={(e) =>
                                    setPaymentForm((prev) => ({
                                      ...prev,
                                      amountToBePaid: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Payment Code</Label>
                                <Input
                                  placeholder="XXXXXXXXX"
                                  value={paymentForm.paymentCode}
                                  onChange={(e) =>
                                    setPaymentForm((prev) => ({
                                      ...prev,
                                      paymentCode: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Payment Method</Label>
                              <Select
                                value={paymentForm.paymentMethod}
                                onValueChange={(value) =>
                                  setPaymentForm((prev) => ({
                                    ...prev,
                                    paymentMethod: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="credit-card">
                                    Credit/Debit Card
                                  </SelectItem>
                                  <SelectItem value="bank-transfer">
                                    Bank Transfer
                                  </SelectItem>
                                  <SelectItem value="wire-transfer">
                                    Wire Transfer
                                  </SelectItem>
                                  <SelectItem value="airport-pickup">
                                    Airport Pickup Fee
                                  </SelectItem>
                                  <SelectItem value="others">Others</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Last Transaction Receipt</Label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                  Click to upload or drag and drop
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Purpose of payment
                              </h3>
                              <div className="space-y-2">
                                {[
                                  "Application Fee",
                                  "Tuition Deposit",
                                  "Accommodation Booking Fee",
                                  "Airport Pickup Fee",
                                  "Others",
                                ].map((purpose) => (
                                  <div
                                    key={purpose}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox id={purpose} />
                                    <Label
                                      htmlFor={purpose}
                                      className="text-sm font-normal"
                                    >
                                      {purpose}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Payment Method
                              </h3>
                              <RadioGroup defaultValue="credit-card">
                                {[
                                  "Credit/Debit Card",
                                  "Bank Transfer",
                                  "Wire Transfer",
                                  "Airport Pickup Fee",
                                  "Others",
                                ].map((method) => (
                                  <div
                                    key={method}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={method
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]/g, "-")}
                                      id={method}
                                    />
                                    <Label
                                      htmlFor={method}
                                      className="text-sm font-normal"
                                    >
                                      {method}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <h4 className="font-semibold text-orange-800 mb-2">
                                Bank Transfer
                              </h4>
                              <div className="space-y-1 text-sm text-orange-700">
                                <div className="flex justify-between">
                                  <span>Bank Name:</span>
                                  <span>Bank of America</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Swift/BIC Number:</span>
                                  <span>BOFAUS3NXXX</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Account Name:</span>
                                  <span>David Morgan</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Account Number:</span>
                                  <span>XXXXXXXXX789</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => setIsPaymentButtonOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={handlePaymentSubmit}
                          >
                            Submit Payment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12">Actions</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Purpose of Payment</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Paid Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPaymentData.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50">
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-medium">
                            {row.transactionId}
                          </TableCell>
                          <TableCell>{row.studentName}</TableCell>
                          <TableCell>{row.studentId}</TableCell>
                          <TableCell>{row.applicationId}</TableCell>
                          <TableCell>{row.purposeOfPayment}</TableCell>
                          <TableCell>{row.paymentMethod}</TableCell>
                          <TableCell>
                            {new Date(row.paymentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${row.paidAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(row.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredPaymentData.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>No payment data found matching your criteria</p>
                  </div>
                )}

                {totalPaymentPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
                    <p className="text-sm text-gray-700">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredPaymentData.length
                      )}{" "}
                      of {filteredPaymentData.length} results
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPaymentPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPaymentPages)
                          )
                        }
                        disabled={currentPage === totalPaymentPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}