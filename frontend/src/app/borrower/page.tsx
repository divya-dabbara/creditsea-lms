'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { loanService } from '@/services/api.service';
import { Loan, LoanStatus } from '@/types';
import { Plus, Clock, CheckCircle, XCircle, Wallet } from 'lucide-react';

export default function BorrowerDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await loanService.getMyLoans();
        setLoans(data.loans);
      } catch (error) {
        console.error('Failed to fetch loans', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const getStatusIcon = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.PENDING: return <Clock className="h-5 w-5 text-yellow-500" />;
      case LoanStatus.APPROVED: return <CheckCircle className="h-5 w-5 text-green-500" />;
      case LoanStatus.REJECTED: return <XCircle className="h-5 w-5 text-red-500" />;
      case LoanStatus.DISBURSED: return <Wallet className="h-5 w-5 text-blue-500" />;
      case LoanStatus.CLOSED: return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Loans</h1>
          <p className="text-gray-400">Track your applications and repayments</p>
        </div>
        <Link href="/borrower/apply">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Apply for Loan
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : loans.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
          <p className="text-gray-500 mb-6">You haven&apos;t applied for any loans yet.</p>
          <Link href="/borrower/apply">
            <Button variant="outline">Start Application</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => (
            <div key={loan._id} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase">Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{loan.loanAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      loan.status === LoanStatus.PENDING ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      loan.status === LoanStatus.APPROVED ? 'bg-green-50 text-green-700 border-green-200' :
                      loan.status === LoanStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {getStatusIcon(loan.status)}
                      {loan.status}
                    </span>
                    <span className="text-xs text-gray-400 mt-2">{new Date(loan.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400">Tenure</p>
                    <p className="text-sm font-medium text-gray-900">{loan.tenureInDays} Days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Repayment</p>
                    <p className="text-sm font-medium text-gray-900">₹{loan.totalRepayment.toLocaleString()}</p>
                  </div>
                </div>

                {loan.status === LoanStatus.REJECTED && loan.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md">
                    <p className="text-xs text-red-600 font-medium italic">Reason: {loan.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
