'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/app/hooks/useAuthStore';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, getProfile, loading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        await getProfile();
      }
    };

    checkAuth();
  }, [isAuthenticated, getProfile]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/">
              <h1 className="text-3xl font-extrabold text-indigo-600">StudyAI</h1>
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}