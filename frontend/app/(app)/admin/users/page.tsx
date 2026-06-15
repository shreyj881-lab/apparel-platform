'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, UserX, UserCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AppShell } from '@/components/layout/AppShell';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { User, UserRole } from '@/types';
import { formatDate } from '@/lib/utils';

function useUsers() {
  return useQuery<{ items: User[]; total: number }>({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
  });
}

export default function AdminUsersPage() {
  const { isAdmin, user: me } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useUsers();
  const [deleting, setDeleting] = useState<User | null>(null);

  const toggleStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/users/${id}/status`, { isActive }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Status updated'); },
    onError: (e: any) => toast.error(e.message),
  });

  const changeRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => api.patch(`/users/${id}/role`, { role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Role updated'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User deleted'); setDeleting(null); },
    onError: (e: any) => toast.error(e.message),
  });

  if (!isAdmin) return <AppShell title="Users"><p className="text-muted-foreground">Admin only.</p></AppShell>;

  return (
    <AppShell title="User Management">
      {isLoading ? <PageLoader /> : (
        <div className="luxury-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                {['Name','Email','Role','Status','Joined','Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.items?.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-semibold shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <select value={u.role} disabled={u.id === me?.id}
                      onChange={(e) => changeRole.mutate({ id: u.id, role: e.target.value as UserRole })}
                      className="rounded-lg border border-border bg-background px-2 py-1 text-xs disabled:opacity-50">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {u.id !== me?.id && (
                        <>
                          <button onClick={() => toggleStatus.mutate({ id: u.id, isActive: !u.isActive })}
                            title={u.isActive ? 'Deactivate' : 'Activate'}
                            className="rounded-lg p-1.5 hover:bg-muted transition text-muted-foreground">
                            {u.isActive ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={() => setDeleting(u)} title="Delete"
                            className="rounded-lg p-1.5 hover:bg-destructive/10 transition text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            {data?.total ?? 0} users total
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleting} variant="danger" title="Delete User"
        description={`Delete ${deleting?.name}? This is permanent.`} confirmLabel="Delete"
        loading={deleteUser.isPending} onConfirm={() => deleting && deleteUser.mutate(deleting.id)}
        onCancel={() => setDeleting(null)} />
    </AppShell>
  );
}
