import { Router } from 'express';
import { createPayment, getLoanPayments } from '../controllers/payment.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

// All payment routes require authentication
router.use(protect);

// Only Collection and Admin roles can record payments
router.post('/', authorize(UserRole.ADMIN, UserRole.COLLECTION), createPayment);

// Anyone with access to the loan can view its payments (Admin, Verifier, or the Borrower themselves - logic handled in controller if needed, but here we restrict to relevant roles for now)
router.get('/loan/:loanId', getLoanPayments);

export default router;
