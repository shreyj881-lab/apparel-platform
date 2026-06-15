'use client';
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface Props { children: React.ReactNode; title?: string; }

export function AppShell({ children, title }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
