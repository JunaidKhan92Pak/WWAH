'use client';

import { useState, useMemo } from 'react';
import { AccommodationBooking, BookingFilterOptions } from '@/types/accommodation';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { BookingFiltersDrawer } from './components/BookingFiltersDrawer';
import { AddBookingModal } from './components/AddBookingModal';
import { mockBookings } from '@/data/mockBookings';
import { AccommodationTable } from './components/AccommodationTable';

export default function AccommodationBookingPage() {
  const [bookings, setBookings] = useState<AccommodationBooking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<BookingFilterOptions>({
    country: '',
    city: '',
    university: '',
    accommodationType: '',
    status: '',
  });

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.applicationId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.country || booking.country === filters.country) &&
        (!filters.city || booking.city === filters.city) &&
        (!filters.university || booking.university.toLowerCase().includes(filters.university.toLowerCase())) &&
        (!filters.accommodationType || booking.accommodationType === filters.accommodationType) &&
        (!filters.status || booking.status === filters.status);

      return matchesSearch && matchesFilters;
    });
  }, [bookings, searchTerm, filters]);

  const handleEdit = (booking: AccommodationBooking) => {
    console.log('Edit booking:', booking);
  };

  const handleDownload = (booking: AccommodationBooking) => {
    console.log('Download booking info:', booking);
  };

  const handleDelete = (booking: AccommodationBooking) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    }
  };

  const handleAddBooking = (booking: Omit<AccommodationBooking, 'id' | 'bookingId'>) => {
    setBookings((prev) => [
      ...prev,
      {
        ...booking,
        id: Date.now().toString(),
        bookingId: `BK-${Date.now()}`,
      },
    ]);
  };

  const handleApplyFilters = () => {
    console.log('Filters applied:', filters);
  };

  const handleClearFilters = () => {
    setFilters({
      country: '',
      city: '',
      university: '',
      accommodationType: '',
      status: '',
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="md:mb-8">
          <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-4 my-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by Booking ID, Name, Application ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 md:pl-10 py-2 w-full border border-gray-300 focus:border-black focus:ring-black placeholder-gray-500 placeholder:text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <BookingFiltersDrawer
                filters={filters}
                onFiltersChange={(updatedFilters: BookingFilterOptions) => setFilters(updatedFilters)}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
              <AddBookingModal onAddBooking={handleAddBooking} />
            </div>
          </div>
        </div>

        <AccommodationTable
          bookings={filteredBookings}
          onEdit={handleEdit}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
