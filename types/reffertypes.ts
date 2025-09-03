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

export interface Referral {
  firstName: string;
  lastName: string;
  id: string;
  profilePicture: string | null;
  status: "accepted" | "pending" | "rejected";
  createdAt: Date;
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
  fullName?: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  contactNo: string;
  dob: string;
  country: string;
  nationality?: string;
  gender?: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  countryCode: string;
  profilePicture?: string | null;
  coverPhoto?: string | null;
  referrals: Referral[];
  referralCode: string;
  refId: number;
  totalReferrals: number;
  commissionPerReferral: number;
  totalCommissionEarned?: number;
  acceptedReferrals?: number;
  provider?: "local" | "google";
  googleId?: string;
  isVerified?: boolean;
  otpVerified?: boolean;
  Commission?: string;
  comissions?: Commission[];
}
export interface Commission {
  _id: string;
  user: string;
  month: string;
  referrals: number;
  amount: number
  status: "Paid" | "Pending" | "Requested";
  createdAt: string;
  updatedAt: string;
}
export interface UserStore {
  user: User | null;
  detailedInfo: DetailedInfo | null;
  commissions: Commission[];
  loading: boolean;
  error: string | null;
  isAuthenticate: boolean;
  lastUpdated?: string;
  embeddingUpdateStatus?: "success" | "error";
  lastEmbeddingUpdate?: string | null;

  // Actions
  fetchUserProfile: (token: string | null) => Promise<void>;
  updateDetailedInfo: (updateData: Partial<DetailedInfo>) => Promise<boolean>;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  setUser: (user: User) => void;
  logout: () => void;
  clearError: () => void;
  getLastUpdatedDate: () => string | null;
  updateUserImages: (imageData: {
    profilePicture?: string;
    coverPhoto?: string;
  }) => void;
  // Commission actions
  fetchCommissions: (userId: string) => Promise<void>;
  createCommission: (
    userId: string,
    commissionData: Omit<Commission, "_id" | "user" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updateCommission: (
    userId: string,
    commissionId: string,
    updateData: Partial<Commission>
  ) => Promise<boolean>;
  deleteCommission: (userId: string, commissionId: string) => Promise<boolean>;
  // profilePicture?: string;
  // coverPhoto?: string;
  // Commission?: string;
}