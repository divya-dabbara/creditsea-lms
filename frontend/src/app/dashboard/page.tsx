'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { SalesModule } from '@/components/dashboard/SalesModule';
import { SanctionModule } from '@/components/dashboard/SanctionModule';
import { DisbursementModule } from '@/components/dashboard/DisbursementModule';
import { CollectionModule } from '@/components/dashboard/CollectionModule';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role === UserRole.BORROWER)) {
      router.push(user ? '/borrower' : '/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white capitalize">{user.role.toLowerCase()} Dashboard</h1>
        <p className="text-gray-400">Manage loan lifecycle and operations</p>
      </div>

      <div className="space-y-8">
        {(user.role === UserRole.SALES || user.role === UserRole.ADMIN) && <SalesModule />}
        {(user.role === UserRole.SANCTION || user.role === UserRole.ADMIN) && <SanctionModule />}
        {(user.role === UserRole.DISBURSEMENT || user.role === UserRole.ADMIN) && <DisbursementModule />}
        {(user.role === UserRole.COLLECTION || user.role === UserRole.ADMIN) && <CollectionModule />}
      </div>
    </div>
  );
}
