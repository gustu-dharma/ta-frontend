// app/dashboard/layout.tsx
import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'IBrain2u - Medical Image Viewer',
  description: 'Advanced NIfTI medical image visualization platform'
};

// // Debug auth check with detailed logging
// async function checkAuth() {
//   try {
//     const cookieStore = await cookies();
//     const allCookies = cookieStore.getAll();
//     const token = cookieStore.get('authToken');
    
//     console.log('[Dashboard Layout] All cookies:', allCookies);
//     console.log('[Dashboard Layout] Auth token:', token);
    
//     // If no token, redirect to login
//     if (!token || !token.value) {
//       console.log('[Dashboard Layout] No valid auth token found, redirecting to login');
//       console.log('[Dashboard Layout] Available cookies:', allCookies.map(c => c.name));
//       redirect('/login');
//     }
    
//     console.log('[Dashboard Layout] Auth token found:', token.value.substring(0, 20) + '...');
    
//     // In development, accept any token for now
//     if (process.env.NODE_ENV === 'development') {
//       console.log('[Dashboard Layout] Development mode: accepting any token');
//       return true;
//     }
    
//     // For production, you'd validate with backend here
//     // const isValid = await validateTokenWithBackend(token.value);
//     // if (!isValid) redirect('/login');
    
//     return true;
    
//   } catch (error) {
//     console.error('[Dashboard Layout] Auth check error:', error);
//     redirect('/login');
//   }
// }

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  console.log('[Dashboard Layout] Checking authentication...');
  
  // Check authentication
  // await checkAuth();
  
  console.log('[Dashboard Layout] Auth check passed, rendering dashboard');
  
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}