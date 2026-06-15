import { cn } from '@/lib/utils';

export function LoadingSpinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size];
  return (
    <div className={cn('animate-spin rounded-full border-2 border-muted border-t-primary', s, className)} />
  );
}

export function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
