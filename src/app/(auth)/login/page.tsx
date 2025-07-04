// app/login/page.tsx
import { Metadata } from 'next';
import LoginViewPage from '@/features/auth/components/login-view';

export const metadata: Metadata = {
  title: 'IBrain2u - Sign In',
  description: 'Sign in to access the medical image viewer.'
};

export default function LoginPage() {
  return <LoginViewPage />;
}