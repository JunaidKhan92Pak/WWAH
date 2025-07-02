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

import { AirportPickup } from '@/types/airport';
import { countries } from '@/data/mockairport';

const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

interface AddAirportPickupModalProps {
  onAddPickup: (pickup: Omit<AirportPickup, 'id' | 'bookingId'>) => void;
}

export function AddAirportPickupModal({ onAddPickup }: AddAirportPickupModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<AirportPickup, 'id' | 'bookingId'>>({
    studentName: '',
    studentId: '',
    applicationId: '',
    country: '',
    city: '',
    university: '',
    arrivalDate: '',
    arrivalTime: '',
    dropoffLocation: '',
    status: 'Pending',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Send only required fields (without id & bookingId)
    onAddPickup(formData);

    // Reset the form
    setFormData({
      studentName: '',
      studentId: '',
      applicationId: '',
      country: '',
      city: '',
      university: '',
      arrivalDate: '',
      arrivalTime: '',
      dropoffLocation: '',
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
          Book Airport Pickup
        </Button>
      </DialogTrigger>

      <DialogContent className="xl:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Airport Pickup</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationId">Application ID</Label>
              <Input
                id="applicationId"
                value={formData.applicationId}
                onChange={(e) => handleInputChange('applicationId', e.target.value)}
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
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrivalDate">Arrival Date</Label>
              <Input
                id="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Arrival Time</Label>
              <Input
                id="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dropoffLocation">Drop-off Location</Label>
              <Input
                id="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
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
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Add Pickup
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
