import { User, LoginPayload, RegisterPayload } from '@/types';
import api from './api';

export async function login(payload: LoginPayload): Promise<{ user: User; accessToken: string }> {
  const data = await api.post<any, any>('/auth/login', payload);
  localStorage.setItem('accessToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function register(payload: RegisterPayload): Promise<{ user: User; accessToken: string }> {
  const data = await api.post<any, any>('/auth/register', payload);
  localStorage.setItem('accessToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function getProfile(): Promise<User> {
  return api.get('/auth/profile');
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const str = localStorage.getItem('user');
  return str ? JSON.parse(str) : null;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}