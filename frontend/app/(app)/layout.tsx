'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/shared/LoadingSpinner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace('/login'); }, [loading, user, router]);
  if (loading) return <PageLoader />;
  if (!user) return null;
  return <>{children}</>;
}
