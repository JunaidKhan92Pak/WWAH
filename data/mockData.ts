import { Application } from '@/types/application';

export const mockApplications: Application[] = [
  {
    id: '1',
    applicationId: 'APP-2024-001',
    studentId: 'STU-001',
    studentName: 'John Smith',
    emailAddress: 'john.smith@email.com',
    preferredCountry: 'United States',
    universityName: 'Harvard University',
    courseApplied: 'Computer Science',
    degreeLevel: 'Bachelor\'s',
    applicationStatus: 'Under Review'
  },
  {
    id: '2',
    applicationId: 'APP-2024-002',
    studentId: 'STU-002',
    studentName: 'Emily Johnson',
    emailAddress: 'emily.johnson@email.com',
    preferredCountry: 'United Kingdom',
    universityName: 'Oxford University',
    courseApplied: 'Medicine',
    degreeLevel: 'Master\'s',
    applicationStatus: 'Accepted'
  },
  {
    id: '3',
    applicationId: 'APP-2024-003',
    studentId: 'STU-003',
    studentName: 'Michael Brown',
    emailAddress: 'michael.brown@email.com',
    preferredCountry: 'Canada',
    universityName: 'University of Toronto',
    courseApplied: 'Engineering',
    degreeLevel: 'Bachelor\'s',
    applicationStatus: 'Submitted'
  },
  {
    id: '4',
    applicationId: 'APP-2024-004',
    studentId: 'STU-004',
    studentName: 'Sarah Davis',
    emailAddress: 'sarah.davis@email.com',
    preferredCountry: 'Australia',
    universityName: 'University of Melbourne',
    courseApplied: 'Business Administration',
    degreeLevel: 'Master\'s',
    applicationStatus: 'Pending'
  },
  {
    id: '5',
    applicationId: 'APP-2024-005',
    studentId: 'STU-005',
    studentName: 'David Wilson',
    emailAddress: 'david.wilson@email.com',
    preferredCountry: 'Germany',
    universityName: 'Technical University of Munich',
    courseApplied: 'Mechanical Engineering',
    degreeLevel: 'PhD',
    applicationStatus: 'Visa Approved'
  },
  {
    id: '6',
    applicationId: 'APP-2024-006',
    studentId: 'STU-006',
    studentName: 'Lisa Anderson',
    emailAddress: 'lisa.anderson@email.com',
    preferredCountry: 'France',
    universityName: 'Sorbonne University',
    courseApplied: 'Art History',
    degreeLevel: 'Master\'s',
    applicationStatus: 'Enrolled'
  },
  {
    id: '7',
    applicationId: 'APP-2024-007',
    studentId: 'STU-007',
    studentName: 'Robert Taylor',
    emailAddress: 'robert.taylor@email.com',
    preferredCountry: 'Netherlands',
    universityName: 'University of Amsterdam',
    courseApplied: 'Psychology',
    degreeLevel: 'Bachelor\'s',
    applicationStatus: 'Rejected'
  },
  {
    id: '8',
    applicationId: 'APP-2024-008',
    studentId: 'STU-008',
    studentName: 'Jennifer Martinez',
    emailAddress: 'jennifer.martinez@email.com',
    preferredCountry: 'Spain',
    universityName: 'University of Barcelona',
    courseApplied: 'International Relations',
    degreeLevel: 'Master\'s',
    applicationStatus: 'Applied'
  }
];

export const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'Malaysia',
  'Ireland',
  'New Zealand',
  'Italy',
];

export const universities = [
  'Harvard University',
  'Oxford University',
  'University of Toronto',
  'University of Melbourne',
  'Technical University of Munich',
  'Sorbonne University',
  'University of Amsterdam',
  'University of Barcelona',
  'Stanford University',
  'MIT'
];

export const degreeLevels = [
  'Bachelor\'s',
  'Master\'s',
  'PhD',
  'Diploma',
  'Certificate'
];

export const applicationStatuses = [
  'Pending',
  'Submitted',
  'Under Review',
  'Applied',
  'Accepted',
  'Rejected',
  'Visa Approved',
  'Enrolled'
];
