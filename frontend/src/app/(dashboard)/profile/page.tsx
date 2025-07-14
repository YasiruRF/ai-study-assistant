'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';
import useAuthStore from '@/app/hooks/useAuthStore';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';

type ProfileFormData = {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    try {
      const userData = {
        username: data.username,
        email: data.email,
      };

      if (changePassword && data.currentPassword && data.newPassword) {
        Object.assign(userData, {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
      }

      await updateProfile(userData);
      toast.success('Profile updated successfully!');
      
      if (changePassword) {
        setChangePassword(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

      <Card className="mb-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Username"
                type="text"
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
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Password</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setChangePassword(!changePassword)}
              >
                {changePassword ? 'Cancel' : 'Change Password'}
              </Button>
            </div>

            {changePassword && (
              <div className="space-y-6">
                <div>
                  <Input
                    label="Current Password"
                    type="password"
                    fullWidth
                    error={errors.currentPassword?.message}
                    {...register('currentPassword', {
                      required: 'Current password is required',
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="New Password"
                      type="password"
                      fullWidth
                      error={errors.newPassword?.message}
                      {...register('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                    />
                  </div>

                  <div>
                    <Input
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      error={errors.confirmPassword?.message}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === newPassword || 'Passwords do not match',
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
              icon={<FiSave />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Account Statistics</h3>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <div className="text-indigo-800 text-sm font-medium mb-1">Total Notes</div>
            <div className="text-2xl font-bold text-indigo-900">--</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="text-purple-800 text-sm font-medium mb-1">Total Flashcards</div>
            <div className="text-2xl font-bold text-purple-900">--</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-blue-800 text-sm font-medium mb-1">Study Streak</div>
            <div className="text-2xl font-bold text-blue-900">--</div>
          </div>
        </div>
      </Card>
    </div>
  );
}