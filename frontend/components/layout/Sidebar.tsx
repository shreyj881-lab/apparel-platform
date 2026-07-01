'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Shirt, Package, Users, Search, LogOut, ChevronLeft, ChevronRight, Ruler } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/styles', label: 'Styles', icon: Shirt },
  { href: '/fabrics', label: 'Fabrics', icon: Package },
  { href: '/measurements', label: 'Measurements', icon: Ruler },
  { href: '/search', label: 'Search', icon: Search },
];
const ADMIN_NAV = [
  { href: '/admin/users', label: 'Users', icon: Users },
];

interface Props { collapsed: boolean; onToggle: () => void; }

export function Sidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const links = isAdmin ? [...NAV, ...ADMIN_NAV] : NAV;

  return (
    <aside className={cn(
      'flex h-screen flex-col border-r border-border bg-card transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <span className="font-playfair text-lg font-bold text-foreground tracking-tight">Apparel</span>
        )}
        <button onClick={onToggle} className="rounded-lg p-1.5 hover:bg-muted transition ml-auto">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}>
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border p-3">
        {!collapsed && user && (
          <div className="mb-2 px-2">
            <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        )}
        <button onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
