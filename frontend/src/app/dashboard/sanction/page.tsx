'use client';

import { SanctionModule } from '@/components/dashboard/SanctionModule';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SanctionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== UserRole.SANCTION && user.role !== UserRole.ADMIN))) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Sanction Dashboard</h1>
        <p className="text-gray-400">Review and approve loan applications</p>
      </div>
      <SanctionModule />
    </div>
  );
}
