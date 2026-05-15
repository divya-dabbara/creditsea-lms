import { Loan } from '../models/loan.model';
import { ILoanDTO, ILoanCalculation, LoanStatus } from '../types/loan.types';
import { BREService } from './bre.service';

export class LoanService {
  private static DEFAULT_INTEREST_RATE = 12; // 12% Annual

  /**
   * Calculates loan interest and total repayment.
   */
  public static calculateLoan(amount: any, tenureInDays: any): ILoanCalculation {
    const numAmount = Number(amount);
    const numTenure = Number(tenureInDays);
    const annualRate = this.DEFAULT_INTEREST_RATE;
    const dailyRate = annualRate / 365 / 100;
    
    const simpleInterest = Math.round(numAmount * dailyRate * numTenure);
    const totalRepayment = numAmount + simpleInterest;

    return {
      simpleInterest,
      totalRepayment,
      interestRate: annualRate
    };
  }

  /**
   * Processes a loan application.
   */
  public static async applyForLoan(borrowerId: string, data: ILoanDTO) {
    // 1. Validate with BRE
    const breResult = BREService.validate(data);
    
    // 2. Perform Calculations
    const calculations = this.calculateLoan(data.loanAmount, data.tenureInDays);

    // 3. Prepare Loan Data
    const loanData = {
      ...data,
      borrower: borrowerId,
      ...calculations,
      status: breResult.eligible ? LoanStatus.PENDING : LoanStatus.REJECTED,
      rejectionReason: breResult.eligible ? undefined : breResult.reason
    };

    // 4. Save to Database
    const loan = await Loan.create(loanData);
    return loan;
  }

  /**
   * Fetches all loans for a borrower or all loans for admin.
   */
  public static async getLoans(filter: object) {
    return await Loan.find(filter).sort({ createdAt: -1 });
  }

  /**
   * Fetches a single loan by ID.
   */
  public static async getLoanById(loanId: string, filter: object = {}) {
    return await Loan.findOne({ _id: loanId, ...filter });
  }
}
