'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Home, Users } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-2xl font-bold">
                  Split<span className="text-green-600">Mint</span>
                </span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-green-600"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/groups"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-green-600"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Groups
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user.name}</span>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
