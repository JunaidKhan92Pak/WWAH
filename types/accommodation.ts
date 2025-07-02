export interface AccommodationBooking {
  id: string;
  bookingId: string; // ✅ Add this field
  studentName: string;
  studentId: string;
  applicationId: string;
  country: string;
  city: string;
  university: string;
  accommodationType: string;
  startDate: string;
  status: string;
}


export type BookingFilterOptions = {
  country?: string;
  city?: string;
  university?: string;
  accommodationType?: string;
  status?: '' | 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'; // 👈 Add '' here
};

export type AccommodationBookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';