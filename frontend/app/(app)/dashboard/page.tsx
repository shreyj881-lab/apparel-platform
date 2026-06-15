'use client';
import React from 'react';
import { Shirt, Package, Users, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { AppShell } from '@/components/layout/AppShell';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { useDashboard } from '@/hooks/useDashboard';
import { formatNumber } from '@/lib/utils';

const COLORS = ['#7c3aed','#6d28d9','#5b21b6','#4c1d95','#3b0764'];

function StatCard({ label, value, icon: Icon, sub }: { label: string; value: number; icon: any; sub?: string }) {
  return (
    <div className="luxury-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{formatNumber(value)}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="rounded-xl bg-primary/10 p-3"><Icon className="h-5 w-5 text-primary" /></div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  if (isLoading) return <AppShell title="Dashboard"><PageLoader /></AppShell>;

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Styles" value={data?.totalStyles ?? 0} icon={Shirt} sub={`${data?.activeStyles ?? 0} active`} />
          <StatCard label="Total Fabrics" value={data?.totalFabrics ?? 0} icon={Package} sub={`${data?.activeFabrics ?? 0} active`} />
          <StatCard label="Users" value={data?.totalUsers ?? 0} icon={Users} />
          <StatCard label="Brick Types" value={data?.brickNameDistribution?.length ?? 0} icon={TrendingUp} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload trend */}
          <div className="luxury-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Upload Trend (12 Weeks)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data?.uploadTrends ?? []}>
                <defs>
                  <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="styles" stroke="#7c3aed" fill="url(#gs)" strokeWidth={2} name="Styles" />
                <Area type="monotone" dataKey="fabrics" stroke="#10b981" fill="none" strokeWidth={2} name="Fabrics" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Brick distribution */}
          <div className="luxury-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Brick Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data?.brickNameDistribution ?? []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="brickName" type="category" tick={{ fontSize: 11 }} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {(data?.brickNameDistribution ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most used fabrics */}
        {data?.mostUsedFabrics?.length ? (
          <div className="luxury-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Most Used Fabrics</h3>
            <div className="space-y-2">
              {data.mostUsedFabrics.slice(0, 8).map((f, i) => (
                <div key={f.fabricUsed} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-foreground">{f.fabricUsed}</span>
                      <span className="text-muted-foreground">{f.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(f.count / (data.mostUsedFabrics[0]?.count || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
