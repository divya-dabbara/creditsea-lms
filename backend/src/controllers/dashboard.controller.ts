import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { LoanStatus } from '../types/loan.types';

// ─── Sales ──────────────────────────────────────────────────────────────────
export const getSalesLeads = async (_req: Request, res: Response) => {
  try {
    const leads = await DashboardService.getRegisteredWithoutApplications();
    res.status(200).json({ success: true, count: leads.length, leads });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Sanction ───────────────────────────────────────────────────────────────
export const getSanctionQueue = async (_req: Request, res: Response) => {
  try {
    const queue = await DashboardService.getPendingLoans();
    res.status(200).json({ success: true, count: queue.length, queue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveLoan = async (req: Request, res: Response) => {
  try {
    const loanId = req.params.id as string;
    const loan = await DashboardService.updateLoanStatus(loanId, LoanStatus.APPROVED);
    res.status(200).json({ success: true, message: 'Loan approved successfully', loan });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rejectLoan = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      res.status(400).json({ success: false, message: 'Rejection reason is required' });
      return;
    }

    const loanId = req.params.id as string;
    const loan = await DashboardService.updateLoanStatus(loanId, LoanStatus.REJECTED, reason);
    res.status(200).json({ success: true, message: 'Loan rejected', loan });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Disbursement ────────────────────────────────────────────────────────────
export const getDisbursementQueue = async (_req: Request, res: Response) => {
  try {
    const queue = await DashboardService.getApprovedLoans();
    res.status(200).json({ success: true, count: queue.length, queue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsDisbursed = async (req: Request, res: Response) => {
  try {
    const loanId = req.params.id as string;
    const loan = await DashboardService.disburseLoan(loanId);
    res.status(200).json({ success: true, message: 'Loan marked as disbursed', loan });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Collection ──────────────────────────────────────────────────────────────
export const getCollectionDashboard = async (_req: Request, res: Response) => {
  try {
    const loans = await DashboardService.getDisbursedLoansWithBalance();
    res.status(200).json({ success: true, count: loans.length, loans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
