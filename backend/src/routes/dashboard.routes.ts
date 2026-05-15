import { Router } from 'express';
import * as DashboardController from '../controllers/dashboard.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

router.use(protect);

// Sales Module
router.get('/sales/leads', authorize(UserRole.SALES, UserRole.ADMIN), DashboardController.getSalesLeads);

// Sanction Module
router.get('/sanction/pending', authorize(UserRole.SANCTION, UserRole.ADMIN), DashboardController.getSanctionQueue);
router.patch('/sanction/approve/:id', authorize(UserRole.SANCTION, UserRole.ADMIN), DashboardController.approveLoan);
router.patch('/sanction/reject/:id', authorize(UserRole.SANCTION, UserRole.ADMIN), DashboardController.rejectLoan);

// Disbursement Module
router.get('/disbursement/approved', authorize(UserRole.DISBURSEMENT, UserRole.ADMIN), DashboardController.getDisbursementQueue);
router.patch('/disbursement/disburse/:id', authorize(UserRole.DISBURSEMENT, UserRole.ADMIN), DashboardController.markAsDisbursed);

// Collection Module
router.get('/collection/active', authorize(UserRole.COLLECTION, UserRole.ADMIN), DashboardController.getCollectionDashboard);

export default router;
