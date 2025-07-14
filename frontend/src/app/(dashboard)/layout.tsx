'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/app/hooks/useAuthStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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
    if (!loading && !isAuthenticated && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}