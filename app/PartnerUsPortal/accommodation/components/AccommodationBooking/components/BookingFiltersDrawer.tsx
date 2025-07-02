'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

import { BookingFilterOptions } from '@/types/accommodation';
import { countries, accommodationTypes, statuses } from '@/data/mockBookings';
import { Input } from '@/components/ui/input';

interface BookingFiltersDrawerProps {
  filters: BookingFilterOptions;
  onFiltersChange: (filters: BookingFilterOptions) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function BookingFiltersDrawer({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: BookingFiltersDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof BookingFilterOptions,
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value,
    });
  };

  const handleApply = () => {
    onApplyFilters();
    setIsOpen(false);
  };

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="right"  className="w-64 md:w-80 md:max-h-screen overflow-y-auto"
>
        <SheetHeader className="flex flex-row items-center justify-between text-start">
          <SheetTitle>Filter Accommodation & Airport Booking Assistance by</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            {/* <X className="h-4 w-4" /> */}
          </Button>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          {/* Country */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">Country</label>
            <Select
              value={filters.country || 'all'}
              onValueChange={(value) => handleFilterChange('country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">City</label>
            <Select
              value={filters.city || 'all'}
              onValueChange={(value) => handleFilterChange('city', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {/* You may want to generate this dynamically later */}
                <SelectItem value="London">London</SelectItem>
                <SelectItem value="Toronto">Toronto</SelectItem>
                <SelectItem value="Sydney">Sydney</SelectItem>
                <SelectItem value="Boston">Boston</SelectItem>
                <SelectItem value="Berlin">Berlin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* University */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">University</label>
            <Input
              type="text"
              placeholder="Enter University Name"
              value={filters.university || ''}
              onChange={(e) =>
                handleFilterChange('university', e.target.value)
              }
            />
          </div>

          {/* Accommodation Type */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Accommodation Type
            </label>
            <Select
              value={filters.accommodationType || 'all'}
              onValueChange={(value) =>
                handleFilterChange('accommodationType', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {accommodationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">Status</label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            Clear Filters
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
