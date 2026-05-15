import { Router } from 'express';
import { applyLoan, getLoans, getLoanDetails } from '../controllers/loan.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

// All routes require authentication
router.use(protect);

// Borrower applies for a loan
router.post('/apply', authorize(UserRole.BORROWER), upload.single('salarySlip'), applyLoan);

// List loans (Admin sees all, Borrower sees own)
router.get('/', getLoans);

// Single loan details
router.get('/:id', getLoanDetails);

export default router;
