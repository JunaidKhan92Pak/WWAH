'use client';

import { useState, useMemo } from 'react';
import { Student, StudentFilterOptions } from '@/types/students';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { StudentFiltersDrawer } from './components/StudentFiltersDrawer';
import { AddStudentModal } from './components/AddStudentModal';
import { mockStudents } from '@/data/mockStudents';
import { StudentsTable } from './components/StudentsTable';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StudentFilterOptions>({
    preferredCountry: '',
    degreeLevel: '',
    fieldOfStudy: '',
    referralSource: '',
    status: undefined
  });

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.preferredCountry || student.preferredCountry === filters.preferredCountry) &&
        (!filters.degreeLevel || student.degreeLevel === filters.degreeLevel) &&
        (!filters.fieldOfStudy || student.fieldOfStudy === filters.fieldOfStudy) &&
        (!filters.referralSource || student.referralSource === filters.referralSource) &&
        (!filters.status || student.status === filters.status);

      return matchesSearch && matchesFilters;
    });
  }, [students, searchTerm, filters]);

  const handleEdit = (student: Student) => {
    console.log('Edit student:', student);
  };

  const handleDownload = (student: Student) => {
    console.log('Download student profile:', student);
  };

  const handleDelete = (student: Student) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    }
  };

  const handleAddStudent = (student: Omit<Student, 'id'>) => {
    setStudents((prev) => [
      ...prev,
      {
        ...student,
        id: Date.now().toString()
      }
    ]);
  };

  const handleApplyFilters = () => {
    console.log('Filters applied:', filters);
  };

  const handleClearFilters = () => {
    setFilters({
      preferredCountry: '',
      degreeLevel: '',
      fieldOfStudy: '',
      referralSource: '',
      status: undefined
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="md:mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-3">Students</h1>

          <div className="flex items-start md:items-center flex-col md:flex-row  md:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by ID, Name, Email or Phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 md:pl-10 py-2 w-full border border-gray-300 focus:border-black focus:ring-black placeholder-gray-500 placeholder:text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <StudentFiltersDrawer
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
              <AddStudentModal onAddStudent={handleAddStudent} />
            </div>
          </div>
        </div>

        <StudentsTable
          students={filteredStudents}
          onEdit={handleEdit}
          onCreateApplication={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
