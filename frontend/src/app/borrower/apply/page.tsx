'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loanService } from '@/services/api.service';
import { EmploymentMode } from '@/types';

export default function ApplyLoanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    pan: '',
    dob: '',
    monthlySalary: '',
    employmentMode: EmploymentMode.SALARIED,
    loanAmount: '',
    tenureInDays: '30',
  });
  const [salarySlip, setSalarySlip] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{ interest: number; total: number } | null>(null);

  // Auto-calculate preview
  useEffect(() => {
    const amount = Number(formData.loanAmount);
    const tenure = Number(formData.tenureInDays);
    
    if (amount > 0 && tenure > 0) {
      const annualRate = 12; // Matching backend default
      const dailyRate = annualRate / 365 / 100;
      const interest = Math.round(amount * dailyRate * tenure);
      setPreview({ interest, total: amount + interest });
    } else {
      setPreview(null);
    }
  }, [formData.loanAmount, formData.tenureInDays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (salarySlip) data.append('salarySlip', salarySlip);

    try {
      const response = await loanService.apply(data);
      if (response.success) {
        router.push('/borrower');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white p-6 shadow sm:rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Apply for a New Loan</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Full Name (as per PAN)"
              required
              autoComplete="off"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <Input
              label="PAN Card Number"
              required
              placeholder="ABCDE1234F"
              autoComplete="off"
              value={formData.pan}
              onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
            />
            <Input
              label="Date of Birth"
              type="date"
              required
              autoComplete="off"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Employment Mode</label>
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                value={formData.employmentMode}
                autoComplete="off"
                onChange={(e) => setFormData({ ...formData, employmentMode: e.target.value as EmploymentMode })}
              >
                <option value={EmploymentMode.SALARIED}>Salaried</option>
                <option value={EmploymentMode.SELF_EMPLOYED}>Self Employed</option>
                <option value={EmploymentMode.UNEMPLOYED}>Unemployed</option>
              </select>
            </div>
            <Input
              label="Monthly Net Salary (₹)"
              type="number"
              required
              autoComplete="off"
              value={formData.monthlySalary}
              onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Salary Slip (PDF/Image)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                autoComplete="off"
                onChange={(e) => setSalarySlip(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Details</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Required Amount (₹)"
                type="number"
                required
                min="1000"
                autoComplete="off"
                value={formData.loanAmount}
                onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
              />
              <Input
                label="Tenure (Days)"
                type="number"
                required
                min="1"
                autoComplete="off"
                value={formData.tenureInDays}
                onChange={(e) => setFormData({ ...formData, tenureInDays: e.target.value })}
              />
            </div>
          </div>

          {preview && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <div className="flex justify-between text-sm text-blue-800">
                <span>Interest (12% p.a.):</span>
                <span className="font-bold">₹{preview.interest}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-900 mt-2">
                <span>Total Repayment:</span>
                <span>₹{preview.total}</span>
              </div>
            </div>
          )}

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Submit Application</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
