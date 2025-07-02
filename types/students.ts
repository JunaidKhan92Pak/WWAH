export type Student = {
  id: string;
  studentId: string;
  studentName: string;
  emailAddress: string;
  phone: string;
  preferredCountry: string;
  nationality: string;
  degreeLevel: string;
  intake: string;
  fieldOfStudy: string;
  referralSource: string;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Withdrawn';
};
;
export type StudentFilterOptions = {
  preferredCountry?: string;
  degreeLevel?: string;
  fieldOfStudy?: string;
  referralSource?: string;
  status?: 'Active' | 'Inactive';
};
