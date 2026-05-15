'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        login(response.token, response.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-900 px-6 py-12 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 shadow-sm rounded-xl border border-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              required
              placeholder="name@company.com"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-100">
                <p className="text-sm font-medium text-red-600 text-center">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href="/register" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
