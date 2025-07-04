// features/auth/components/user-auth-form.tsx - Simple fix
'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2, Bug } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

type UserFormValue = z.infer<typeof formSchema>;

interface UserAuthFormProps {
  type: 'signup' | 'login';
}

export default function UserAuthForm({ type }: UserAuthFormProps) {
  const [loading, startTransition] = useTransition();
  const [debugMode, setDebugMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  const defaultValues = {
    name: type === 'signup' ? '' : undefined,
    email: '',
    password: ''
  };
  
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const bypassAuth = () => {
    console.log('[DEBUG] Bypassing auth');
    const debugToken = `debug-token-${Date.now()}`;
    document.cookie = `authToken=${debugToken}; path=/; max-age=86400; SameSite=Lax`;
    toast.success('Debug: Going to dashboard');
    setTimeout(() => window.location.href = '/dashboard', 500);
  };
  
  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      try {
        const endpoint = type === 'signup' ? '/auth/register' : '/auth/login';
        const url = `${BASE_URL}${endpoint}`;
        
        console.log(`[Auth] Sending ${type} request to:`, url);

        const response = await axios.post(url, data);

        console.log(`[Auth] Response received:`, response.data);
        
        // Handle YOUR backend response format
        if (response.status === 200 || response.status === 201) {
          
          if (type === 'signup') {
            toast.success('Account created! Please login.');
            router.push('/login');
            return;
          }

          // For LOGIN - your backend returns: {accessToken, refreshToken, user}
          const { accessToken, user } = response.data.data;
          
          if (accessToken) {
            // Set the token as cookie manually since backend might not be setting it
            document.cookie = `authToken=${accessToken}; path=/; max-age=3600; SameSite=Lax`;
            
            console.log('[Auth] Token set, redirecting to dashboard');
            toast.success(`Welcome back, ${user?.name || user?.email}!`);

            
            // Redirect after short delay
            setTimeout(() => {
              if (user.role === 'admin') {
              window.location.href = '/dashboard/admin';
              } else if (user.role === 'doctor') {
                window.location.href = '/dashboard/doctor';
              }
              else if (user.role === 'staff') {
                window.location.href = '/dashboard/staff';
              }
              else {
                window.location.href = '/dashboard/pattient';
              }

            }, 1000);
          } else {
            console.warn('[Auth] No access token in response');
            toast.error('Login successful but no token received');
            setDebugMode(true);
          }
        } else {
          toast.error('Unexpected response from server');
          setDebugMode(true);
        }
        
      } catch (error: any) {
        console.error(`[Auth] ${type} error:`, error);
        
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const data = error.response?.data;
          
          if (status === 400) {
            toast.error('Invalid email or password');
          } else if (status === 401) {
            toast.error('Invalid credentials');
          } else if (status === 409) {
            toast.error('Account already exists');
          } else if (error.code === 'ECONNREFUSED') {
            toast.error('Cannot connect to server. Make sure backend is running on port 3001');
          } else {
            toast.error(`Error: ${data?.message || error.message}`);
          }
        } else {
          toast.error('Something went wrong');
        }
        
        setDebugMode(true);
      }
    });
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4'>
          {type === 'signup' && (
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter your full name'
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='gus@gmail.com'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Your password'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className='w-full' type='submit'>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === 'signup' ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              type === 'signup' ? 'Create Account' : 'Sign In'
            )}
          </Button>
        </form>
      </Form>

      {debugMode && type === 'login' && (
        <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Bug className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Something went wrong</span>
          </div>
          <p className="text-xs text-orange-700 mb-3">
            Login failed. Try debug mode to bypass authentication.
          </p>
          <Button 
            onClick={bypassAuth}
            variant="outline" 
            size="sm"
            className="w-full text-orange-700 border-orange-300 hover:bg-orange-100"
          >
            <Bug className="mr-2 h-4 w-4" />
            Use Debug Mode
          </Button>
        </div>
      )}
      
      <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
        <strong>Test Account:</strong> gus@gmail.com<br />
        <strong>API:</strong> {BASE_URL}<br />
        <strong>Status:</strong> {document.cookie.includes('authToken') ? 'Logged In' : 'Not Logged In'}
      </div>
    </div>
  );
}