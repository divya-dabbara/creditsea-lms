'use client';

import React, { useEffect, useState } from 'react';
import { dashboardService } from '@/services/api.service';
import { Loan } from '@/types';
import { Button } from '../ui/Button';
import { FileText, Check, X } from 'lucide-react';

export function SanctionModule() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = async () => {
    const data = await dashboardService.getPending();
    setLoans(data.queue);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      if (action === 'approve') {
        await dashboardService.approve(id);
      } else {
        const reason = window.prompt('Enter rejection reason:');
        if (!reason) return;
        await dashboardService.reject(id, reason);
      }
      setSuccessMessage(`Loan ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchData();
    } catch (error) {
      console.error('Action failed', error);
      alert('Failed to process request');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-medium leading-6 text-gray-900">Pending Approvals</h3>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center">Loading applications...</td></tr>
            ) : loans.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No pending applications.</td></tr>
            ) : loans.map((loan) => (
              <tr key={loan._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{loan.fullName}</div>
                  <div className="text-xs text-gray-500">PAN: {loan.pan}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">₹{loan.loanAmount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{loan.tenureInDays} Days</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{loan.monthlySalary.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button 
                    size="sm" 
                    variant="primary" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(loan._id, 'approve')}
                    isLoading={processingId === loan._id}
                  >
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => handleAction(loan._id, 'reject')}
                    isLoading={processingId === loan._id}
                  >
                    <X className="h-4 w-4 mr-1" /> Reject
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
