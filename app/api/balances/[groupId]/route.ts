import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { calculateGroupBalances } from '@/lib/balance';
import { prisma } from '@/lib/prisma';

// GET /api/balances/[groupId] - Get balances and settlements for a group
export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify group ownership
    const group = await prisma.group.findUnique({
      where: {
        id: params.groupId,
        createdBy: user.userId,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Calculate balances
    const result = await calculateGroupBalances(params.groupId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculate balances error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
