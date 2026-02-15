'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface Member {
  name: string;
  avatarColor: string;
}

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export default function NewGroupPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    if (members.length >= 3) {
      setError('Maximum 3 additional members allowed');
      return;
    }

    setMembers([
      ...members,
      {
        name: newMemberName.trim(),
        avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      },
    ]);
    setNewMemberName('');
    setError('');
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: groupName,
          members,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create group');
      }

      const data = await response.json();
      router.push(`/dashboard/groups/${data.group.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard" className="text-green-600 hover:text-green-700 flex items-center mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Group</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Trip to Bali, Roommates, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Members (Max 3)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Member name"
                disabled={members.length >= 3}
              />
              <button
                type="button"
                onClick={handleAddMember}
                disabled={members.length >= 3}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {members.length > 0 && (
              <div className="space-y-2">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: member.avatarColor }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{member.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-2">
              You will be automatically added as a member. You can add up to 3 more people.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !groupName.trim()}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
