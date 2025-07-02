'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AirportPickupFiltersDrawer } from './components/AirportPickupFiltersDrawer';
import { AddAirportPickupModal } from './components/AddAirportPickupModal';
import { AirportPickupTable } from './components/AirportPickupTable';
import { mockairport } from '@/data/mockairport';
import {
  AirportPickup,
  AirportPickupFilterOptions,
} from '@/types/airport';

export default function AirportPickupPage() {
  const [pickups, setPickups] = useState<AirportPickup[]>(mockairport);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AirportPickupFilterOptions>({
  country: '',
  city: '',
  university: '',
  dropoffLocation: '',
  arrivalDate: '',
  arrivalTime: '',
  status: undefined, 
});

  const filteredPickups = useMemo(() => {
    return pickups.filter((pickup) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        pickup.bookingId.toLowerCase().includes(search) ||
        pickup.studentName.toLowerCase().includes(search) ||
        pickup.studentId.toLowerCase().includes(search) ||
        pickup.applicationId.toLowerCase().includes(search);

      const matchesFilters =
        (!filters.country || pickup.country === filters.country) &&
        (!filters.city || pickup.city === filters.city) &&
        (!filters.university || pickup.university === filters.university) &&
        (!filters.dropoffLocation || pickup.dropoffLocation === filters.dropoffLocation) &&
        (!filters.status || pickup.status === filters.status) &&
        (!filters.arrivalDate || pickup.arrivalDate.split('T')[0] === filters.arrivalDate) &&
        (!filters.arrivalTime || pickup.arrivalTime === filters.arrivalTime);

      return matchesSearch && matchesFilters;
    });
  }, [pickups, searchTerm, filters]);

  const handleEdit = (pickup: AirportPickup) => {
    console.log('Edit pickup:', pickup);
  };

  const handleDownload = (pickup: AirportPickup) => {
    console.log('Download pickup info:', pickup);
  };

  const handleDelete = (pickup: AirportPickup) => {
    if (confirm('Are you sure you want to delete this pickup?')) {
      setPickups((prev) => prev.filter((p) => p.id !== pickup.id));
    }
  };

  const handleAddPickup = (pickup: Omit<AirportPickup, 'id' | 'bookingId'>) => {
    const timestamp = Date.now().toString();
    setPickups((prev) => [
      ...prev,
      {
        ...pickup,
        id: timestamp,
        bookingId: `AIR-${timestamp}`,
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
      dropoffLocation: '',
      status: '',
      arrivalDate: '',
      arrivalTime: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:mb-8">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-4 my-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by Student Name, Student ID, or Application ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 md:pl-10 py-2 w-full border border-gray-300 focus:border-black focus:ring-black placeholder-gray-500 placeholder:text-sm"
            />
          </div>

          {/* Filters + Add Button */}
          <div className="flex items-center gap-3">
            <AirportPickupFiltersDrawer
              filters={filters}
              onFiltersChange={setFilters}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
            <AddAirportPickupModal onAddPickup={handleAddPickup} />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <AirportPickupTable
        bookings={filteredPickups}
        onEdit={handleEdit}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  );
}
