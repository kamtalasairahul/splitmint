import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { calculateSplits } from '@/lib/balance';
import { z } from 'zod';

const createExpenseSchema = z.object({
  groupId: z.string(),
  payerId: z.string(),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().optional(),
  splitType: z.enum(['EQUAL', 'CUSTOM', 'PERCENTAGE']),
  customSplits: z.array(z.object({
    participantId: z.string(),
    amount: z.number(),
  })).optional(),
  percentageSplits: z.array(z.object({
    participantId: z.string(),
    percentage: z.number(),
  })).optional(),
  participantIds: z.array(z.string()).optional(),
});

// GET /api/expenses?groupId=xxx - Get all expenses for a group
export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const search = searchParams.get('search');
    const participantId = searchParams.get('participantId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    // Verify group ownership
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
        createdBy: user.userId,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Build filter conditions
    const where: any = { groupId };

    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (participantId) {
      where.OR = [
        { payerId: participantId },
        { splits: { some: { participantId } } },
      ];
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = parseFloat(minAmount);
      if (maxAmount) where.amount.lte = parseFloat(maxAmount);
    }

    // Build order by
    const orderBy: any = {};
    if (sortBy === 'date') {
      orderBy.date = sortOrder;
    } else if (sortBy === 'amount') {
      orderBy.amount = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        payer: true,
        splits: {
          include: {
            participant: true,
          },
        },
      },
      orderBy,
    });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createExpenseSchema.parse(body);

    // Verify group ownership
    const group = await prisma.group.findUnique({
      where: {
        id: validatedData.groupId,
        createdBy: user.userId,
      },
      include: {
        members: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Determine participants
    let participantIds = validatedData.participantIds || group.members.map(m => m.id);

    // Calculate splits
    const splits = calculateSplits(
      validatedData.amount,
      validatedData.splitType,
      participantIds,
      validatedData.customSplits,
      validatedData.percentageSplits
    );

    // Validate total split amount
    const totalSplit = splits.reduce((sum, split) => sum + split.shareAmount, 0);
    if (Math.abs(totalSplit - validatedData.amount) > 0.01) {
      return NextResponse.json(
        { error: 'Split amounts do not match total amount' },
        { status: 400 }
      );
    }

    // Create expense with splits
    const expense = await prisma.expense.create({
      data: {
        groupId: validatedData.groupId,
        payerId: validatedData.payerId,
        amount: validatedData.amount,
        description: validatedData.description,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        splitType: validatedData.splitType,
        splits: {
          create: splits.map(split => ({
            participantId: split.participantId,
            shareAmount: split.shareAmount,
          })),
        },
      },
      include: {
        payer: true,
        splits: {
          include: {
            participant: true,
          },
        },
      },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Create expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
