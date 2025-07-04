// features/auth/components/login-view.tsx
'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';

export default function LoginViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/signup'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Sign Up
      </Link>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6" />
            <path d="m15.5 3.5-2 2m0 6-2 2m0 6-2 2" />
            <path d="m8.5 3.5 2 2m0 6 2 2m0 6 2 2" />
          </svg>
          IBrain2u
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Advanced medical imaging visualization platform for healthcare professionals and researchers.&rdquo;
            </p>
            <footer className='text-sm'>IBrain2u Medical Platform</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Welcome back
            </h1>
            <p className='text-sm text-muted-foreground'>
              Sign in to your account to access the medical image viewer
            </p>
          </div>
          <UserAuthForm type='login' />
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              Don&apos;t have an account?{' '}
              <Link
                href='/signup'
                className='underline underline-offset-4 hover:text-primary font-medium'
              >
                Sign up here
              </Link>
            </p>
          </div>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By continuing, you agree to our{' '}
            <Link
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}