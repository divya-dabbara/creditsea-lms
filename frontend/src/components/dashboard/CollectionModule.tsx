'use client';

import React, { useEffect, useState } from 'react';
import { dashboardService, paymentService } from '@/services/api.service';
import { Loan } from '@/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { IndianRupee, History } from 'lucide-react';

export function CollectionModule() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({
    utrNumber: '',
    amount: '',
  });

  const fetchData = async () => {
    const data = await dashboardService.getActiveLoans();
    setLoans(data.loans);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecord = async (loanId: string) => {
    if (!paymentData.utrNumber || !paymentData.amount) {
      alert('Please fill UTR and Amount');
      return;
    }
    
    setRecordingId(loanId);
    try {
      await paymentService.record({
        loanId,
        utrNumber: paymentData.utrNumber,
        amount: Number(paymentData.amount),
        paymentDate: new Date().toISOString(),
      });
      setPaymentData({ utrNumber: '', amount: '' });
      setSuccessMessage('Payment recorded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to record payment');
    } finally {
      setRecordingId(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-medium leading-6 text-gray-900">Active Collections</h3>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record Repayment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : loans.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No active loans for collection.</td></tr>
            ) : loans.map((loan: any) => (
              <tr key={loan._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{loan.fullName}</div>
                  <div className="text-xs text-gray-500">Loan: ₹{loan.loanAmount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-red-600">
                    ₹{loan.outstandingBalance?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs text-gray-500">Total: ₹{loan.totalRepayment.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="UTR Number" 
                      className="w-32"
                      value={recordingId === loan._id ? paymentData.utrNumber : ''}
                      onChange={(e) => {
                        setRecordingId(loan._id);
                        setPaymentData({ ...paymentData, utrNumber: e.target.value });
                      }}
                    />
                    <Input 
                      placeholder="Amount" 
                      type="number"
                      className="w-24"
                      value={recordingId === loan._id ? paymentData.amount : ''}
                      onChange={(e) => {
                        setRecordingId(loan._id);
                        setPaymentData({ ...paymentData, amount: e.target.value });
                      }}
                    />
                    <Button 
                      size="sm"
                      onClick={() => handleRecord(loan._id)}
                      isLoading={recordingId === loan._id && !paymentData.utrNumber} // Simplified logic
                    >
                      Record
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
