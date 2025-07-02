import { AirportPickup } from "@/types/airport";

// ---------------- Mock Data ----------------

export const mockairport: AirportPickup[] = [
  {
    id: "1",
    bookingId: "AIR-2025-001",
    studentName: "Ali Khan",
    studentId: "STU-001",
    applicationId: "APP-2025-001",
    country: "Canada",
    city: "Toronto",
    university: "University of Toronto",
    arrivalDate: "2025-09-01",
    arrivalTime: "10:30",
    dropoffLocation: "Campus Main Gate",
    status: "Pending",
  },
  {
    id: "2",
    bookingId: "AIR-2025-002",
    studentName: "Fatima Ahmed",
    studentId: "STU-002",
    applicationId: "APP-2025-002",
    country: "United Kingdom",
    city: "London",
    university: "King’s College London",
    arrivalDate: "2025-08-25",
    arrivalTime: "08:00",
    dropoffLocation: "Dormitory B",
    status: "Confirmed",
  },
  {
    id: "3",
    bookingId: "AIR-2025-003",
    studentName: "John Doe",
    studentId: "STU-003",
    applicationId: "APP-2025-003",
    country: "Australia",
    city: "Sydney",
    university: "University of Sydney",
    arrivalDate: "2025-09-10",
    arrivalTime: "18:45",
    dropoffLocation: "Residence Hall 3",
    status: "Completed",
  },
  {
    id: "4",
    bookingId: "AIR-2025-004",
    studentName: "Sara Malik",
    studentId: "STU-004",
    applicationId: "APP-2025-004",
    country: "Germany",
    city: "Berlin",
    university: "Humboldt University",
    arrivalDate: "2025-09-05",
    arrivalTime: "13:15",
    dropoffLocation: "International Office",
    status: "Cancelled",
  },
];

// ------------- Constants for Filters -------------

export const countries: string[] = [
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
];

export const cities: string[] = [
  "Toronto",
  "London",
  "Sydney",
  "Berlin",
];

export const universities: string[] = [
  "University of Toronto",
  "King’s College London",
  "University of Sydney",
  "Humboldt University",
];

export const statuses: AirportPickup["status"][] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];
export const dropoffLocations: string[] = [
  "Campus Main Gate",
  "Dormitory B",
  "Residence Hall 3",
  "International Office",
];