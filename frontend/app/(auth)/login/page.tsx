'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type F = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: F) => {
    try { setLoading(true); await login(data); router.push('/dashboard'); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-card border border-border shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="font-playfair text-3xl font-bold text-foreground">Apparel Platform</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
            <input {...register('email')} type="email" placeholder="you@example.com" autoComplete="email"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            {errors.email && <p className="text-xs text-destructive mt-0.5">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Password</label>
            <input {...register('password')} type="password" placeholder="••••••••" autoComplete="current-password"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            {errors.password && <p className="text-xs text-destructive mt-0.5">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No account? <Link href="/register" className="text-primary hover:underline font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}
