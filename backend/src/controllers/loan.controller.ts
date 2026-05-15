import { Request, Response } from 'express';
import { LoanService } from '../services/loan.service';
import { AuthRequest, UserRole } from '../types/user.types';
import { ILoanDTO, LoanStatus } from '../types/loan.types';

export const applyLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const borrowerId = authReq.user!.id;
    const loanData: ILoanDTO = req.body;

    // Optional: If files are uploaded (salary slip)
    if (req.file) {
      loanData.salarySlipUrl = req.file.path;
    }

    const loan = await LoanService.applyForLoan(borrowerId, loanData);

    res.status(201).json({
      success: true,
      message: loan.status === LoanStatus.REJECTED 
        ? `Loan application rejected: ${loan.rejectionReason}` 
        : 'Loan application submitted successfully',
      loan
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to apply for loan' });
  }
};

export const getLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const filter = authReq.user!.role === UserRole.BORROWER 
      ? { borrower: authReq.user!.id } 
      : {};

    const loans = await LoanService.getLoans(filter);
    res.status(200).json({ success: true, count: loans.length, loans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch loans' });
  }
};

export const getLoanDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const filter = authReq.user!.role === UserRole.BORROWER 
      ? { borrower: authReq.user!.id } 
      : {};

    const loanId = req.params.id as string;
    const loan = await LoanService.getLoanById(loanId, filter);
    
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    res.status(200).json({ success: true, loan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch loan details' });
  }
};
