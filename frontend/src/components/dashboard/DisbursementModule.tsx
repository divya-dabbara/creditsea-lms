'use client';

import React, { useEffect, useState } from 'react';
import { dashboardService } from '@/services/api.service';
import { Loan } from '@/types';
import { Button } from '../ui/Button';
import { Wallet, Send } from 'lucide-react';

export function DisbursementModule() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = async () => {
    const data = await dashboardService.getApproved();
    setLoans(data.queue);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDisburse = async (id: string) => {
    if (!window.confirm('Confirm disbursement of funds?')) return;
    setProcessingId(id);
    try {
      await dashboardService.disburse(id);
      setSuccessMessage('Loan disbursed successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchData();
    } catch (error) {
      console.error('Disbursement failed', error);
      alert('Failed to disburse funds');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-medium leading-6 text-gray-900">Approved Loans (Ready for Disbursement)</h3>
        </div>
        {successMessage && (
          <span className="text-sm font-medium text-green-600 animate-pulse">
            {successMessage}
          </span>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : loans.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No loans ready for disbursement.</td></tr>
            ) : loans.map((loan) => (
              <tr key={loan._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono uppercase">
                  {loan._id.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {loan.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                  ₹{loan.loanAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDisburse(loan._id)}
                    isLoading={processingId === loan._id}
                  >
                    <Send className="h-4 w-4 mr-1" /> Disburse
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
