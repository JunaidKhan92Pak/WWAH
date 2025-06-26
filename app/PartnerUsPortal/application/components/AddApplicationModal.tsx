'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { countries, universities, degreeLevels, applicationStatuses } from '@/data/mockData';
import { Application } from '@/types/application';


interface AddApplicationModalProps {
  onAddApplication: (application: Omit<Application, 'id'>) => void;
}

export function AddApplicationModal({ onAddApplication }: AddApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    applicationId: '',
    studentId: '',
    studentName: '',
    emailAddress: '',
    preferredCountry: '',
    universityName: '',
    courseApplied: '',
    degreeLevel: '',
    applicationStatus: 'Pending' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddApplication(formData);
    setFormData({
      applicationId: '',
      studentId: '',
      studentName: '',
      emailAddress: '',
      preferredCountry: '',
      universityName: '',
      courseApplied: '',
      degreeLevel: '',
      applicationStatus: 'Pending'
    });
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Application
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationId">Application ID</Label>
              <Input
                id="applicationId"
                value={formData.applicationId}
                onChange={(e) => handleInputChange('applicationId', e.target.value)}
                placeholder="e.g., APP-2024-009"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="e.g., STU-009"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                placeholder="student@email.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredCountry">Preferred Country</Label>
              <Select value={formData.preferredCountry} onValueChange={(value) => handleInputChange('preferredCountry', value)}>
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
              <Label htmlFor="universityName">University Name</Label>
              <Select value={formData.universityName} onValueChange={(value) => handleInputChange('universityName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((university) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseApplied">Course Applied</Label>
              <Input
                id="courseApplied"
                value={formData.courseApplied}
                onChange={(e) => handleInputChange('courseApplied', e.target.value)}
                placeholder="e.g., Computer Science"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degreeLevel">Degree Level</Label>
              <Select value={formData.degreeLevel} onValueChange={(value) => handleInputChange('degreeLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Degree Level" />
                </SelectTrigger>
                <SelectContent>
                  {degreeLevels.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationStatus">Application Status</Label>
            <Select value={formData.applicationStatus} onValueChange={(value) => handleInputChange('applicationStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {applicationStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Add Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}