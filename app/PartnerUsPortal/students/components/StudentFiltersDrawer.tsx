'use client';

import { useState } from 'react';
import { StudentFilterOptions } from '@/types/students';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { countries, degreeLevels, fieldsOfStudy, referralSources } from '@/data/mockStudents';

const statuses = ['Active', 'Inactive'];

interface StudentFiltersDrawerProps {
  filters: StudentFilterOptions;
  onFiltersChange: (filters: StudentFilterOptions) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function StudentFiltersDrawer({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: StudentFiltersDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof StudentFilterOptions,
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
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
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Filter Students by</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          />
        </SheetHeader>

        <div className="space-y-4 mt-4">
          {/* Preferred Country */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Preferred Country
            </label>
            <Select
              value={filters.preferredCountry || 'all'}
              onValueChange={(value) =>
                handleFilterChange('preferredCountry', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
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

          {/* Degree Level */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Degree Level
            </label>
            <Select
              value={filters.degreeLevel || 'all'}
              onValueChange={(value) =>
                handleFilterChange('degreeLevel', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Degrees</SelectItem>
                {degreeLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field of Study */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Field of Study
            </label>
            <Select
              value={filters.fieldOfStudy || 'all'}
              onValueChange={(value) =>
                handleFilterChange('fieldOfStudy', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                {fieldsOfStudy.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Referral Source */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Referral Source
            </label>
            <Select
              value={filters.referralSource || 'all'}
              onValueChange={(value) =>
                handleFilterChange('referralSource', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {referralSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Status */}
          <div className="md:space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Student Status
            </label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
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
