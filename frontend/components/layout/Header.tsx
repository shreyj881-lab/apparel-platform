'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';

interface Props { title?: string; }

export function Header({ title }: Props) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="font-playfair text-xl font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/search')}
          className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition">
          <Search className="h-4 w-4" />
        </button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        {user && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
