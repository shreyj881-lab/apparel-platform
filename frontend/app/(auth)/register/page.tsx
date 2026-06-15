'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });
type F = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: F) => {
    try { setLoading(true); await authRegister(data); router.push('/dashboard'); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-card border border-border shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="font-playfair text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join Apparel Platform</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {([['name','Full Name','text','Mayank Jain',errors.name],['email','Email','email','you@example.com',errors.email],['password','Password','password','••••••••',errors.password]] as const).map(([n,l,t,p,e]) => (
            <div key={n}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{l}</label>
              <input {...register(n)} type={t} placeholder={p}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {e && <p className="text-xs text-destructive mt-0.5">{(e as any).message}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50">
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Have an account? <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
