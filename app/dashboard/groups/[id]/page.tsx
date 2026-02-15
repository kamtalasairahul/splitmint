'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, DollarSign, Users as UsersIcon } from 'lucide-react';
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  avatarColor: string;
  isPrimaryUser: boolean;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  payer: Member;
  splitType: string;
  splits: Array<{
    shareAmount: number;
    participant: Member;
  }>;
}

interface Balance {
  participantId: string;
  participantName: string;
  netBalance: number;
}

interface Settlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [splitType, setSplitType] = useState<'EQUAL' | 'CUSTOM' | 'PERCENTAGE'>('EQUAL');

  useEffect(() => {
    if (params.id) {
      fetchGroup();
      fetchBalances();
    }
  }, [params.id, token]);

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setGroup(data.group);
      if (data.group?.members.length > 0) {
        setPayerId(data.group.members[0].id);
      }
    } catch (error) {
      console.error('Error fetching group:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async () => {
    try {
      const response = await fetch(`/api/balances/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBalances(data.balances || []);
      setSettlements(data.settlements || []);
      setTotalSpent(data.totalGroupSpent || 0);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupId: params.id,
          payerId,
          amount: parseFloat(amount),
          description,
          splitType,
          participantIds: group.members.map((m: Member) => m.id),
        }),
      });

      if (response.ok) {
        setShowExpenseForm(false);
        setDescription('');
        setAmount('');
        setSplitType('EQUAL');
        fetchGroup();
        fetchBalances();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchGroup();
        fetchBalances();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!group) return <div className="text-center py-8">Group not found</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard" className="text-green-600 hover:text-green-700 flex items-center mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <p className="text-gray-600 mt-1">{group.members.length} members</p>
          </div>
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">You Owe</p>
              <p className="text-2xl font-bold text-red-600">
                $
                {balances
                  .filter(b => b.netBalance < 0)
                  .reduce((sum, b) => sum + Math.abs(b.netBalance), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">You Are Owed</p>
              <p className="text-2xl font-bold text-green-600">
                $
                {balances
                  .filter(b => b.netBalance > 0)
                  .reduce((sum, b) => sum + b.netBalance, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      {showExpenseForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Dinner, groceries, etc."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid by
                </label>
                <select
                  value={payerId}
                  onChange={(e) => setPayerId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {group.members.map((member: Member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split Type
              </label>
              <select
                value={splitType}
                onChange={(e) => setSplitType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="EQUAL">Equal Split</option>
                <option value="CUSTOM">Custom Amounts</option>
                <option value="PERCENTAGE">Percentage Split</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowExpenseForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Settlements */}
      {settlements.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Settlements</h2>
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{settlement.fromName}</span>
                  <span className="text-gray-600 mx-2">→</span>
                  <span className="font-medium">{settlement.toName}</span>
                </div>
                <span className="font-bold text-green-600">${settlement.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Expenses</h2>
        {group.expenses && group.expenses.length > 0 ? (
          <div className="space-y-3">
            {group.expenses.map((expense: Expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-600">
                    Paid by {expense.payer.name} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">${Number(expense.amount).toFixed(2)}</span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No expenses yet. Add your first expense!</p>
        )}
      </div>
    </div>
  );
}
