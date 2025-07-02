import { Student } from '@/types/students';

export const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'STU-001',
    studentName: 'John Smith',
    emailAddress: 'john.smith@email.com',
    phone: '+1234567890',
    preferredCountry: 'United States',
    nationality: 'American',
    degreeLevel: 'Bachelor',
    intake: 'Fall 2025',
    fieldOfStudy: 'Computer Science',
    referralSource: 'Instagram',
    status: 'Active'
  },
  {
    id: '2',
    studentId: 'STU-002',
    studentName: 'Emily Johnson',
    emailAddress: 'emily.johnson@email.com',
    phone: '+1234567891',
    preferredCountry: 'United Kingdom',
    nationality: 'British',
    degreeLevel: 'Master',
    intake: 'Spring 2026',
    fieldOfStudy: 'Business Administration',
    referralSource: 'Agent',
    status: 'Active'
  },
  {
    id: '3',
    studentId: 'STU-003',
    studentName: 'Michael Brown',
    emailAddress: 'michael.brown@email.com',
    phone: '+1234567892',
    preferredCountry: 'Canada',
    nationality: 'Canadian',
    degreeLevel: 'Bachelor',
    intake: 'Winter 2026',
    fieldOfStudy: 'Engineering',
    referralSource: 'Website',
    status: 'Inactive'
  },
  {
    id: '4',
    studentId: 'STU-004',
    studentName: 'Sarah Davis',
    emailAddress: 'sarah.davis@email.com',
    phone: '+1234567893',
    preferredCountry: 'Australia',
    nationality: 'Australian',
    degreeLevel: 'Master',
    intake: 'Summer 2025',
    fieldOfStudy: 'Education',
    referralSource: 'Facebook',
    status: 'Active'
  },
  {
    id: '5',
    studentId: 'STU-005',
    studentName: 'David Wilson',
    emailAddress: 'david.wilson@email.com',
    phone: '+1234567894',
    preferredCountry: 'Germany',
    nationality: 'German',
    degreeLevel: 'PhD',
    intake: 'Fall 2025',
    fieldOfStudy: 'Physics',
    referralSource: 'Referral',
    status: 'Inactive'
  },
  {
    id: '6',
    studentId: 'STU-006',
    studentName: 'Lisa Anderson',
    emailAddress: 'lisa.anderson@email.com',
    phone: '+1234567895',
    preferredCountry: 'France',
    nationality: 'French',
    degreeLevel: 'Master',
    intake: 'Spring 2026',
    fieldOfStudy: 'International Relations',
    referralSource: 'Instagram',
    status: 'Active'
  },
  {
    id: '7',
    studentId: 'STU-007',
    studentName: 'Robert Taylor',
    emailAddress: 'robert.taylor@email.com',
    phone: '+1234567896',
    preferredCountry: 'Netherlands',
    nationality: 'Dutch',
    degreeLevel: 'Bachelor',
    intake: 'Winter 2026',
    fieldOfStudy: 'Art & Design',
    referralSource: 'Google Ads',
    status: 'Inactive'
  },
  {
    id: '8',
    studentId: 'STU-008',
    studentName: 'Jennifer Martinez',
    emailAddress: 'jennifer.martinez@email.com',
    phone: '+1234567897',
    preferredCountry: 'Spain',
    nationality: 'Spanish',
    degreeLevel: 'Master',
    intake: 'Summer 2025',
    fieldOfStudy: 'Tourism & Hospitality',
    referralSource: 'Agent',
    status: 'Active'
  }
];
export const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'Australia',
  'France',
  'Netherlands',
  'Spain'
];

export const nationalities = [
  'American',
  'British',
  'Canadian',
  'Australian',
  'German',
  'French',
  'Dutch',
  'Spanish',
  'Italian',
  'Swedish'
];

export const degreeLevels = ['Bachelor', 'Master', 'PhD'];

export const intakes = ['Fall 2025', 'Spring 2026', 'Winter 2026', 'Summer 2025'];

export const fieldsOfStudy = [
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Education',
  'Physics',
  'International Relations',
  'Art & Design',
  'Tourism & Hospitality'
];

export const referralSources = [
  'Instagram',
  'Facebook',
  'Google Ads',
  'Agent',
  'Website',
  'Referral'
];

export const studentStatuses = ['Active', 'Inactive', 'Graduated', 'Withdrawn'];
