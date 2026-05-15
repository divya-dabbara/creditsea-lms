import api from '@/lib/api';
import { Loan, LoanStatus, Payment, User } from '@/types';

// ─── Auth Services ────────────────────────────────────────────────────────────
export const authService = {
  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ─── Loan Services ───────────────────────────────────────────────────────────
export const loanService = {
  apply: async (formData: FormData) => {
    const response = await api.post('/loans/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getMyLoans: async () => {
    const response = await api.get('/loans');
    return response.data;
  },
  getLoanDetails: async (id: string) => {
    const response = await api.get(`/loans/${id}`);
    return response.data;
  },
};

// ─── Dashboard Services ──────────────────────────────────────────────────────
export const dashboardService = {
  // Sales
  getLeads: async () => {
    const response = await api.get('/dashboard/sales/leads');
    return response.data;
  },
  // Sanction
  getPending: async () => {
    const response = await api.get('/dashboard/sanction/pending');
    return response.data;
  },
  approve: async (id: string) => {
    const response = await api.patch(`/dashboard/sanction/approve/${id}`);
    return response.data;
  },
  reject: async (id: string, reason: string) => {
    const response = await api.patch(`/dashboard/sanction/reject/${id}`, { reason });
    return response.data;
  },
  // Disbursement
  getApproved: async () => {
    const response = await api.get('/dashboard/disbursement/approved');
    return response.data;
  },
  disburse: async (id: string) => {
    const response = await api.patch(`/dashboard/disbursement/disburse/${id}`);
    return response.data;
  },
  // Collection
  getActiveLoans: async () => {
    const response = await api.get('/dashboard/collection/active');
    return response.data;
  },
};

// ─── Payment Services ────────────────────────────────────────────────────────
export const paymentService = {
  record: async (data: { loanId: string; utrNumber: string; amount: number; paymentDate: string }) => {
    const response = await api.post('/payments', data);
    return response.data;
  },
  getHistory: async (loanId: string) => {
    const response = await api.get(`/payments/loan/${loanId}`);
    return response.data;
  },
};
