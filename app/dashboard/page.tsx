'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  members: any[];
  _count: { expenses: number };
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, [token]);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/dashboard/groups/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Group
        </Link>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No groups yet</h3>
          <p className="text-gray-500 mb-4">Create your first group to start tracking expenses</p>
          <Link
            href="/dashboard/groups/new"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Group
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/dashboard/groups/${group.id}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
              <div className="text-sm text-gray-600 mb-4">
                {group.members.length} members • {group._count.expenses} expenses
              </div>
              <div className="flex items-center text-green-600">
                <span className="text-sm">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
