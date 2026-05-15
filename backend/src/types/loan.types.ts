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

export interface ILoanDTO {
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl?: string;
  loanAmount: number;
  tenureInDays: number;
}

export interface IBREResult {
  eligible: boolean;
  reason?: string;
}

export interface ILoanCalculation {
  simpleInterest: number;
  totalRepayment: number;
  interestRate: number;
}
