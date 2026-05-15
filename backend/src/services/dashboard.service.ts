import { User } from '../models/user.model';
import { Loan } from '../models/loan.model';
import { LoanStatus } from '../types/loan.types';
import { UserRole } from '../types/user.types';
import { PaymentService } from './payment.service';

export class DashboardService {
  // ─── Sales ──────────────────────────────────────────────────────────────────
  public static async getRegisteredWithoutApplications() {
    // Get all users with role BORROWER
    const borrowers = await User.find({ role: UserRole.BORROWER }).select('name email createdAt');
    
    // Get all borrower IDs who have at least one loan application
    const borrowerIdsWithLoans = await Loan.distinct('borrower');
    
    // Filter out users who have applied
    const usersWithoutLoans = borrowers.filter(
      user => !borrowerIdsWithLoans.some(id => id.toString() === user._id.toString())
    );
    
    return usersWithoutLoans;
  }

  // ─── Sanction ───────────────────────────────────────────────────────────────
  public static async getPendingLoans() {
    return await Loan.find({ status: LoanStatus.PENDING }).populate('borrower', 'name email');
  }

  public static async updateLoanStatus(loanId: string, status: LoanStatus, reason?: string) {
    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error('Loan not found');

    // Transition Validation
    if (loan.status !== LoanStatus.PENDING) {
      throw new Error(`Only PENDING loans can be approved or rejected. Current status: ${loan.status}`);
    }

    loan.status = status;
    if (reason) loan.rejectionReason = reason;
    
    await loan.save();
    return loan;
  }

  // ─── Disbursement ────────────────────────────────────────────────────────────
  public static async getApprovedLoans() {
    return await Loan.find({ status: LoanStatus.APPROVED }).populate('borrower', 'name email');
  }

  public static async disburseLoan(loanId: string) {
    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error('Loan not found');

    // Transition Validation
    if (loan.status !== LoanStatus.APPROVED) {
      throw new Error(`Only APPROVED loans can be disbursed. Current status: ${loan.status}`);
    }

    loan.status = LoanStatus.DISBURSED;
    await loan.save();
    return loan;
  }

  // ─── Collection ──────────────────────────────────────────────────────────────
  public static async getDisbursedLoansWithBalance() {
    const loans = await Loan.find({ status: LoanStatus.DISBURSED }).populate('borrower', 'name email');
    
    const loansWithBalance = await Promise.all(loans.map(async (loan) => {
      const balance = await PaymentService.calculateOutstandingBalance(loan._id.toString());
      return {
        ...loan.toObject(),
        outstandingBalance: balance
      };
    }));

    return loansWithBalance;
  }
}
