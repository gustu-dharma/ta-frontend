// app/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken');

  // Jika user sudah login, redirect ke dashboard
  if (authToken) {
    redirect('/dashboard');
  }

  // Jika belum login, redirect ke login page
  redirect('/login');
}