import { Payment } from '../models/payment.model';
import { Loan } from '../models/loan.model';
import { IPaymentDTO, IPaymentResponse } from '../types/payment.types';
import { LoanStatus } from '../types/loan.types';
import mongoose from 'mongoose';

export class PaymentService {
  /**
   * Calculates the current outstanding balance of a loan.
   */
  public static async calculateOutstandingBalance(loanId: string): Promise<number> {
    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error('Loan not found');

    const totalPaidResult = await Payment.aggregate([
      { $match: { loan: new mongoose.Types.ObjectId(loanId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalPaid = totalPaidResult.length > 0 ? totalPaidResult[0].total : 0;
    return Math.max(0, loan.totalRepayment - totalPaid);
  }

  /**
   * Records a new payment and updates loan status if fully paid.
   * NOTE: Transactions are disabled for local standalone MongoDB compatibility.
   * Transactions can be re-enabled when using MongoDB Atlas replica sets in production.
   */
  public static async recordPayment(collectorId: string, data: IPaymentDTO): Promise<IPaymentResponse> {
    const loan = await Loan.findById(data.loanId);
    if (!loan) throw new Error('Loan not found');

    // 1. Check if loan is DISBURSED
    if (loan.status !== LoanStatus.DISBURSED) {
      throw new Error(`Payments can only be recorded for DISBURSED loans. Current status: ${loan.status}`);
    }

    // 2. Check for duplicate UTR
    const existingUTR = await Payment.findOne({ utrNumber: data.utrNumber.toUpperCase() });
    if (existingUTR) throw new Error('Duplicate UTR number detected');

    // 3. Prevent overpayment
    const numAmount = Number(data.amount);
    const outstanding = await this.calculateOutstandingBalance(data.loanId);
    if (numAmount > outstanding) {
      throw new Error(`Payment amount (₹${numAmount}) exceeds outstanding balance (₹${outstanding})`);
    }

    // 4. Create Payment
    const payment = await Payment.create({
      loan: data.loanId,
      utrNumber: data.utrNumber.toUpperCase(),
      amount: numAmount,
      paymentDate: data.paymentDate,
      collectedBy: collectorId
    });

    // 5. Update Loan Status if fully repaid
    const newOutstanding = outstanding - numAmount;
    if (newOutstanding <= 0) {
      loan.status = LoanStatus.CLOSED;
      await loan.save();
    }

    return {
      success: true,
      message: newOutstanding <= 0 ? 'Payment successful. Loan closed.' : 'Payment recorded successfully.',
      payment,
      outstandingBalance: newOutstanding
    };
  }

  /**
   * Fetches payments for a specific loan.
   */
  public static async getPaymentsByLoan(loanId: string) {
    return await Payment.find({ loan: loanId }).populate('collectedBy', 'name email').sort({ paymentDate: -1 });
  }
}
