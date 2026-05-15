import mongoose, { Document, Schema } from 'mongoose';
import { LoanStatus, EmploymentMode } from '../types/loan.types';

export interface ILoan extends Document {
  borrower: mongoose.Types.ObjectId;
  fullName: string;
  pan: string;
  dob: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>(
  {
    borrower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true, trim: true },
    pan: { 
      type: String, 
      required: true, 
      uppercase: true, 
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please provide a valid PAN'] 
    },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 0 },
    employmentMode: { 
      type: String, 
      enum: Object.values(EmploymentMode), 
      required: true 
    },
    salarySlipUrl: { type: String },
    loanAmount: { type: Number, required: true, min: 1000 },
    tenureInDays: { type: Number, required: true, min: 1 },
    interestRate: { type: Number, required: true },
    simpleInterest: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
    rejectionReason: { type: String },
    status: { 
      type: String, 
      enum: Object.values(LoanStatus), 
      default: LoanStatus.PENDING 
    },
  },
  { timestamps: true }
);

export const Loan = mongoose.model<ILoan>('Loan', LoanSchema);
