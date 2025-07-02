'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

import { countries, degreeLevels } from '@/data/mockData';
import { Student } from '@/types/students';

interface AddStudentModalProps {
  onAddStudent: (student: Omit<Student, 'id'>) => void;
}

export function AddStudentModal({ onAddStudent }: AddStudentModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    studentId: '',
    studentName: '',
    emailAddress: '',
    phone: '',
    preferredCountry: '',
    degreeLevel: '',
    fieldOfStudy: '',
    referralSource: '',
    status: 'Active',
    intake: '',
    nationality: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent(formData);
    setFormData({
      studentId: '',
      studentName: '',
      emailAddress: '',
      phone: '',
      preferredCountry: '',
      degreeLevel: '',
      fieldOfStudy: '',
      referralSource: '',
      status: 'Active',
      intake: '',
      nationality: ''
    });
    setIsOpen(false);
  };

  const handleInputChange = (field: keyof Omit<Student, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#FCE7D2] hover:bg-[#ffe1c3] text-red-500 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Student
        </Button>
      </DialogTrigger>
      <DialogContent className="xl:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="studentName">Full Name</Label>
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
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredCountry">Preferred Country</Label>
              <Select
                value={formData.preferredCountry}
                onValueChange={(value) => handleInputChange('preferredCountry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Preferred Country" />
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
              <Label htmlFor="degreeLevel">Degree Level</Label>
              <Select
                value={formData.degreeLevel}
                onValueChange={(value) => handleInputChange('degreeLevel', value)}
              >
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

            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input
                id="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralSource">Referral Source</Label>
              <Input
                id="referralSource"
                value={formData.referralSource}
                onChange={(e) => handleInputChange('referralSource', e.target.value)}
                placeholder="e.g., Instagram, Agent, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intake">Intake</Label>
              <Input
                id="intake"
                value={formData.intake}
                onChange={(e) => handleInputChange('intake', e.target.value)}
                placeholder="e.g., Fall 2025"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="e.g., Pakistani"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Add Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
