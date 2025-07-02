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
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';
import { AirportPickupFilterOptions } from '@/types/airport';
import { countries, statuses, cities, universities } from '@/data/mockairport';

interface AirportPickupFiltersDrawerProps {
  filters: AirportPickupFilterOptions;
  onFiltersChange: (filters: AirportPickupFilterOptions) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function AirportPickupFiltersDrawer({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: AirportPickupFiltersDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof AirportPickupFilterOptions,
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

      <SheetContent
        side="right"
        className="w-64 md:w-80 md:max-h-screen overflow-y-auto"
      >
        <SheetHeader className="text-start">
          <SheetTitle>
            Filter Accommodation & Airport Booking Assistance by
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3 mt-2">
          {/* Country */}
          <div>
            <label className="text-sm font-medium text-gray-900">Country</label>
            <Select
              value={filters.country || 'all'}
              onValueChange={(value) => handleFilterChange('country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium text-gray-900">City</label>
            <Select
              value={filters.city || 'all'}
              onValueChange={(value) => handleFilterChange('city', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* University */}
          <div>
            <label className="text-sm font-medium text-gray-900">University</label>
            <Select
              value={filters.university || 'all'}
              onValueChange={(value) => handleFilterChange('university', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {universities.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Arrival Date */}
          <div>
            <label className="text-sm font-medium text-gray-900">Arrival Date</label>
            <Input
              type="date"
              value={filters.arrivalDate || ''}
              onChange={(e) =>
                handleFilterChange('arrivalDate', e.target.value)
              }
            />
          </div>

          {/* Arrival Time */}
          <div>
            <label className="text-sm font-medium text-gray-900">Arrival Time</label>
            <Input
              type="time"
              value={filters.arrivalTime || ''}
              onChange={(e) =>
                handleFilterChange('arrivalTime', e.target.value)
              }
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-900">Status</label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
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
