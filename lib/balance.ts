import { prisma } from './prisma';
import { Decimal } from '@prisma/client/runtime/library';

export interface Balance {
  participantId: string;
  participantName: string;
  netBalance: number;
}

export interface Settlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

export interface BalanceResult {
  balances: Balance[];
  settlements: Settlement[];
  totalGroupSpent: number;
}

/**
 * Calculate net balances for all participants in a group
 */
export async function calculateGroupBalances(groupId: string): Promise<BalanceResult> {
  // Get all expenses with their splits
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: {
      payer: true,
      splits: {
        include: {
          participant: true,
        },
      },
    },
  });

  // Get all group members
  const members = await prisma.groupMember.findMany({
    where: { groupId },
  });

  // Initialize balance map
  const balanceMap = new Map<string, { name: string; paid: number; share: number }>();
  
  members.forEach(member => {
    balanceMap.set(member.id, {
      name: member.name,
      paid: 0,
      share: 0,
    });
  });

  let totalGroupSpent = 0;

  // Calculate paid and share amounts
  expenses.forEach(expense => {
    const amount = Number(expense.amount);
    totalGroupSpent += amount;

    // Add to payer's paid amount
    const payerBalance = balanceMap.get(expense.payerId);
    if (payerBalance) {
      payerBalance.paid += amount;
    }

    // Add to each participant's share amount
    expense.splits.forEach(split => {
      const participantBalance = balanceMap.get(split.participantId);
      if (participantBalance) {
        participantBalance.share += Number(split.shareAmount);
      }
    });
  });

  // Calculate net balances
  const balances: Balance[] = Array.from(balanceMap.entries()).map(([id, data]) => ({
    participantId: id,
    participantName: data.name,
    netBalance: data.paid - data.share,
  }));

  // Calculate minimal settlements
  const settlements = calculateMinimalSettlements(balances);

  return {
    balances,
    settlements,
    totalGroupSpent,
  };
}

/**
 * Calculate minimal settlements using greedy algorithm
 */
function calculateMinimalSettlements(balances: Balance[]): Settlement[] {
  const settlements: Settlement[] = [];
  
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances
    .filter(b => b.netBalance > 0.01)
    .map(b => ({ ...b }))
    .sort((a, b) => b.netBalance - a.netBalance);
  
  const debtors = balances
    .filter(b => b.netBalance < -0.01)
    .map(b => ({ ...b, netBalance: Math.abs(b.netBalance) }))
    .sort((a, b) => b.netBalance - a.netBalance);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.netBalance, debtor.netBalance);

    if (amount > 0.01) {
      settlements.push({
        from: debtor.participantId,
        fromName: debtor.participantName,
        to: creditor.participantId,
        toName: creditor.participantName,
        amount: Math.round(amount * 100) / 100,
      });
    }

    creditor.netBalance -= amount;
    debtor.netBalance -= amount;

    if (creditor.netBalance < 0.01) {
      i++;
    }
    if (debtor.netBalance < 0.01) {
      j++;
    }
  }

  return settlements;
}

/**
 * Calculate splits based on split type
 */
export function calculateSplits(
  amount: number,
  splitType: 'EQUAL' | 'CUSTOM' | 'PERCENTAGE',
  participants: string[],
  customSplits?: { participantId: string; amount: number }[],
  percentageSplits?: { participantId: string; percentage: number }[]
): { participantId: string; shareAmount: number }[] {
  switch (splitType) {
    case 'EQUAL':
      return calculateEqualSplit(amount, participants);
    
    case 'CUSTOM':
      if (!customSplits || customSplits.length === 0) {
        throw new Error('Custom splits are required for CUSTOM split type');
      }
      return customSplits.map(split => ({
        participantId: split.participantId,
        shareAmount: split.amount,
      }));
    
    case 'PERCENTAGE':
      if (!percentageSplits || percentageSplits.length === 0) {
        throw new Error('Percentage splits are required for PERCENTAGE split type');
      }
      return calculatePercentageSplit(amount, percentageSplits);
    
    default:
      throw new Error('Invalid split type');
  }
}

/**
 * Calculate equal split with proper rounding
 */
function calculateEqualSplit(
  amount: number,
  participants: string[]
): { participantId: string; shareAmount: number }[] {
  const count = participants.length;
  const baseAmount = Math.floor((amount * 100) / count) / 100;
  const remainder = Math.round((amount - baseAmount * count) * 100) / 100;

  return participants.map((participantId, index) => ({
    participantId,
    shareAmount: index === 0 ? baseAmount + remainder : baseAmount,
  }));
}

/**
 * Calculate percentage split
 */
function calculatePercentageSplit(
  amount: number,
  percentageSplits: { participantId: string; percentage: number }[]
): { participantId: string; shareAmount: number }[] {
  const totalPercentage = percentageSplits.reduce((sum, split) => sum + split.percentage, 0);
  
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error('Percentages must sum to 100');
  }

  let totalAllocated = 0;
  const splits = percentageSplits.map((split, index) => {
    let shareAmount: number;
    
    if (index === percentageSplits.length - 1) {
      // Last participant gets the remainder to handle rounding
      shareAmount = amount - totalAllocated;
    } else {
      shareAmount = Math.round((amount * split.percentage) / 100 * 100) / 100;
      totalAllocated += shareAmount;
    }

    return {
      participantId: split.participantId,
      shareAmount,
    };
  });

  return splits;
}
