export interface Application {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  emailAddress: string;
  preferredCountry: string;
  universityName: string;
  courseApplied: string;
  degreeLevel: string;
  applicationStatus: ApplicationStatus;
}

export type ApplicationStatus = 
  | 'Pending'
  | 'Submitted'
  | 'Under Review'
  | 'Applied'
  | 'Accepted'
  | 'Rejected'
  | 'Visa Approved'
  | 'Enrolled';

export interface FilterOptions {
  preferredCountry: string;
  universityName: string;
  degreeLevel: string;
  applicationStatus: string;
}