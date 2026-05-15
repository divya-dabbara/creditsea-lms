'use client';

import { CollectionModule } from '@/components/dashboard/CollectionModule';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CollectionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== UserRole.COLLECTION && user.role !== UserRole.ADMIN))) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Collection Dashboard</h1>
        <p className="text-gray-400">Track repayments and manage active collections</p>
      </div>
      <CollectionModule />
    </div>
  );
}
