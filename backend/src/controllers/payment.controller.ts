import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { AuthRequest } from '../types/user.types';
import { IPaymentDTO } from '../types/payment.types';

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const collectorId = authReq.user!.id;
    const paymentData: IPaymentDTO = req.body;

    const result = await PaymentService.recordPayment(collectorId, paymentData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLoanPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const loanId = req.params.loanId as string;
    const payments = await PaymentService.getPaymentsByLoan(loanId);
    const outstanding = await PaymentService.calculateOutstandingBalance(loanId);

    res.status(200).json({ 
      success: true, 
      count: payments.length, 
      outstandingBalance: outstanding,
      payments 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
