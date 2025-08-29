export interface AcademicInfo {
  currentDegree: string;
  program: string;
  uniName: string;
  currentSemester: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInfo {
  preferredPaymentMethod: string;
  bankAccountTitle: string;
  bankName: string;
  accountNumberIban: string;
  mobileWalletNumber: string;
  accountHolderName: string;
  termsAndAgreement: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExp {
  hasWorkExperience: boolean;
  hasBrandAmbassador: boolean;
  jobDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  firstName: string;
  lastName: string;
  user: User;
}

export interface DetailedInfo {
  AcademicInformation: AcademicInfo;
  paymentInformation: PaymentInfo;
  workExperience: WorkExp;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  facebook: string;
  instagram: string;
  linkedin: string;
  contactNo: string;
  dob: string;
  country: string;
  nationality: string;
  gender: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  countryCode: string;
  profilePicture?: string;
  coverPhoto?: string;
  // detailedInfo: DetailedInfo;
}
