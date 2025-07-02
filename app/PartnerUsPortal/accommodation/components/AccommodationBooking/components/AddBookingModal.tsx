'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

import { AccommodationBooking } from '@/types/accommodation';
import { countries, accommodationTypes, statuses } from '@/data/mockBookings';

interface AddBookingModalProps {
  onAddBooking: (booking: Omit<AccommodationBooking, 'id' | 'bookingId'>) => void;
}

export function AddBookingModal({ onAddBooking }: AddBookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<AccommodationBooking, 'id' | 'bookingId'>>({
    studentName: '',
    studentId: '',
    applicationId: '',
    country: '',
    city: '',
    university: '',
    accommodationType: '',
    startDate: '',
    status: 'Pending',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      ...formData,
      bookingId: `BK-${Date.now()}`, // Auto-generate Booking ID
    };
    onAddBooking(newBooking);
    setFormData({
      studentName: '',
      studentId: '',
      applicationId: '',
      country: '',
      city: '',
      university: '',
      accommodationType: '',
      startDate: '',
      status: 'Pending',
    });
    setIsOpen(false);
  };

  const handleInputChange = <K extends keyof typeof formData>(field: K, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#FCE7D2] hover:bg-[#ffe1c3] text-red-500 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Book Accomodation
        </Button>
      </DialogTrigger>
      <DialogContent className="xl:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Accommodation Booking</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) =>
                  handleInputChange('studentName', e.target.value)
                }
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) =>
                  handleInputChange('studentId', e.target.value)
                }
                placeholder="e.g., STU-001"
                required
              />
            </div>
          </div>

          {/* Application Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationId">Application ID</Label>
              <Input
                id="applicationId"
                value={formData.applicationId}
                onChange={(e) =>
                  handleInputChange('applicationId', e.target.value)
                }
                placeholder="e.g., APP-2025-01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* City + University */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="e.g., London"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) =>
                  handleInputChange('university', e.target.value)
                }
                placeholder="e.g., University of Toronto"
                required
              />
            </div>
          </div>

          {/* Accommodation Type + Date */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accommodationType">Accommodation Type</Label>
              <Select
                value={formData.accommodationType}
                onValueChange={(value) =>
                  handleInputChange('accommodationType', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {accommodationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  handleInputChange('startDate', e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Add Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
