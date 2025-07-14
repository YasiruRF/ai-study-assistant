'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import useAuthStore from '@/app/hooks/useAuthStore';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.email, data.password);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      toast.error('Login failed');
    }
  };

  return (
    <>
      <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
      <p className="mt-2 text-gray-600">Sign in to your account</p>

      <Card className="mt-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              fullWidth
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              fullWidth
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              icon={<FiLogIn />}
            >
              Sign in
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </>
  );
}