import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AuthForm = dynamic(
  () => import('@/components/auth/AuthForm').then(mod => ({ default: mod.AuthForm })),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false // Since we're using client-side auth
  }
);

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <AuthForm />
      </Suspense>
    </div>
  );
}