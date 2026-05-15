'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/Button';
import { UserRole } from '@/types';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-white relative z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              CreditSea LMS
            </Link>
            {user && (
              <div className="hidden md:flex gap-4">
                {user.role === UserRole.BORROWER ? (
                  <>
                    <Link href="/borrower" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                      My Loans
                    </Link>
                    <Link href="/borrower/apply" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                      Apply Now
                    </Link>
                  </>
                ) : (
                  <Link 
                    href={
                      user.role === UserRole.SANCTION ? '/dashboard/sanction' :
                      user.role === UserRole.DISBURSEMENT ? '/dashboard/disbursement' :
                      user.role === UserRole.COLLECTION ? '/dashboard/collection' :
                      '/dashboard'
                    } 
                    className="text-sm font-medium text-gray-600 hover:text-blue-600"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
