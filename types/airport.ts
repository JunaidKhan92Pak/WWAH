// ----------------------
// Types for Airport Pickup
// ----------------------

export type AirportPickup = {
  id: string;
  bookingId: string; // ✅ CORRECT
  studentName: string;
  studentId: string;
  applicationId: string;
  country: string;
  city: string;
  university: string;
  arrivalDate: string;
  arrivalTime: string;
  dropoffLocation: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
};

// Filter Options for UI Drawer
export type AirportPickupFilterOptions = {
  country?: string;
  city?: string;
  university?: string;
  dropoffLocation?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  status?: '' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
};


