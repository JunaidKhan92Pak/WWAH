'use client';

import { useState } from 'react';
import { AirportPickup } from '@/types/airport';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Download, Trash2 } from 'lucide-react';

interface AirportPickupTableProps {
  bookings: AirportPickup[];
  onEdit: (booking: AirportPickup) => void;
  onDownload: (booking: AirportPickup) => void;
  onDelete: (booking: AirportPickup) => void;
}

export function AirportPickupTable({
  bookings,
  onEdit,
  onDownload,
  onDelete,
}: AirportPickupTableProps) {
  const [expandedView, setExpandedView] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>

              {expandedView && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Airport Drop Off Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => onEdit(booking)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Booking
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload(booking)} className="cursor-pointer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(booking)}
                        className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Booking
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="px-8 py-3 text-sm text-gray-900">{booking.studentName}</td>
                <td className="px-8 py-3 text-sm text-gray-900">{booking.studentId}</td>
                <td className="px-8 py-3 text-sm text-gray-900">{booking.applicationId}</td>
                <td className="px-8 py-3 text-sm text-gray-900">{booking.country}</td>
                <td className="px-8 py-3 text-sm text-gray-900">{booking.city}</td>

                {expandedView && (
                  <>
                    <td className="px-10 py-3 text-sm text-gray-900">{booking.university}</td>
                    <td className="px-10 py-3 text-sm text-gray-900">{booking.arrivalDate}</td>
                    <td className="px-10 py-3 text-sm text-gray-900">{booking.dropoffLocation}</td>
                    <td className="px-10 py-3 text-sm text-gray-900">{booking.status}</td>
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
          {expandedView ? 'Show Less Columns' : 'Show More Columns'}
        </Button>
      </div>
    </div>
  );
}

export default AirportPickupTable;
