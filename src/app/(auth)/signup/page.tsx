// app/signup/page.tsx
import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/signup-view';

export const metadata: Metadata = {
  title: 'IBrain2u - Sign Up',
  description: 'Create an account to access the medical image viewer.'
};

export default function SignupPage() {
  return <SignUpViewPage />;
}