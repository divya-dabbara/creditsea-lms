export enum UserRole {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  SANCTION = 'SANCTION',
  DISBURSEMENT = 'DISBURSEMENT',
  COLLECTION = 'COLLECTION',
  BORROWER = 'BORROWER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  CLOSED = 'CLOSED',
}

export enum EmploymentMode {
  SALARIED = 'SALARIED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  UNEMPLOYED = 'UNEMPLOYED',
}

export interface Loan {
  _id: string;
  borrower: string | Partial<User>;
  fullName: string;
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl?: string;
  loanAmount: number;
  tenureInDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  rejectionReason?: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  loan: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  collectedBy: Partial<User>;
  createdAt: string;
}
