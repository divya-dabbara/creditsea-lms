'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.BORROWER,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      if (response.success) {
        login(response.token, response.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-900 px-6 py-12 lg:px-8">
      <div className="w-full max-w-lg bg-white p-8 shadow-sm rounded-xl border border-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Join the LMS platform to manage your loans
          </p>
        </div>

        <div className="mt-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                required
                placeholder="John Doe"
                autoComplete="off"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <Input
                label="Email address"
                type="email"
                required
                placeholder="john@example.com"
                autoComplete="off"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="off"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              helperText="Minimum 6 characters"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.BORROWER}>Borrower (Individual)</option>
                <option value={UserRole.SALES}>Sales Team</option>
                <option value={UserRole.SANCTION}>Sanction Officer</option>
                <option value={UserRole.DISBURSEMENT}>Disbursement Team</option>
                <option value={UserRole.COLLECTION}>Collection Team</option>
              </select>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-100">
                <p className="text-sm font-medium text-red-600 text-center">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign up
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
