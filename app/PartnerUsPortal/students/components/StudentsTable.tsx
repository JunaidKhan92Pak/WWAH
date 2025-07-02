'use client';

import { useState } from 'react';
import { Student } from '@/types/students';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onCreateApplication: (student: Student) => void; // renamed
  onDelete: (student: Student) => void;
}


export function StudentsTable({
  students,
  onEdit,
  onCreateApplication,
  onDelete,
}: StudentsTableProps) {
  const [expandedView, setExpandedView] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Country</th>
              {expandedView && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field of Study</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => onEdit(student)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Student
                      </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onCreateApplication(student)} className="cursor-pointer">
  <Plus className="mr-2 h-4 w-4" />
  Create Application
</DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onDelete(student)}
                        className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="px-8 py-4 text-sm text-gray-900">{student.studentId}</td>
                <td className="px-8 py-4 text-sm text-gray-900">{student.studentName}</td>
                <td className="px-8 py-4 text-sm text-gray-900">{student.emailAddress}</td>
                <td className="px-8 py-4 text-sm text-gray-900">{student.preferredCountry}</td>
                {expandedView && (
                  <>
                    <td className="px-10 py-4 text-sm text-gray-900">{student.degreeLevel}</td>
                    <td className="px-10 py-4 text-sm text-gray-900">{student.fieldOfStudy}</td>
                    <td className="px-10 py-4 text-sm text-gray-900">{student.referralSource}</td>
                    <td className="px-10 py-4 text-sm text-gray-900">{student.status}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpandedView(!expandedView)}
          className="text-xs"
        >
          {expandedView ? 'Show Less' : 'Show More Columns'}
        </Button>
        {/* <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <div className="w-8 h-1 bg-gray-400 rounded"></div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
          </div>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div> */}
      </div>
    </div>
  );
}
