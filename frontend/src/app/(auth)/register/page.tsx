'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import useAuthStore from '@/app/hooks/useAuthStore';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, loading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await registerUser(data.username, data.email, data.password);
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      toast.error('Registration failed');
    }
  };

  return (
    <>
      <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
      <p className="mt-2 text-gray-600">Join StudyAI today</p>

      <Card className="mt-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="Username"
              type="text"
              autoComplete="username"
              fullWidth
              error={errors.username?.message}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
            />
          </div>

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
              autoComplete="new-password"
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
            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              fullWidth
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              })}
            />
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              icon={<FiUserPlus />}
            >
              Sign up
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </>
  );
}