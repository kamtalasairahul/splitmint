import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { calculateSplits } from '@/lib/balance';
import { z } from 'zod';

const updateExpenseSchema = z.object({
  payerId: z.string().optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  date: z.string().optional(),
  splitType: z.enum(['EQUAL', 'CUSTOM', 'PERCENTAGE']).optional(),
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

// GET /api/expenses/[id] - Get a specific expense
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: {
        payer: true,
        splits: {
          include: {
            participant: true,
          },
        },
        group: true,
      },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // Verify ownership
    if (expense.group.createdBy !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ expense });
  } catch (error) {
    console.error('Get expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/expenses/[id] - Update an expense
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateExpenseSchema.parse(body);

    // Get existing expense
    const existingExpense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: {
        group: {
          include: {
            members: true,
          },
        },
        splits: true,
      },
    });

    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // Verify ownership
    if (existingExpense.group.createdBy !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};
    
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
    }
    
    if (validatedData.date !== undefined) {
      updateData.date = new Date(validatedData.date);
    }
    
    if (validatedData.payerId !== undefined) {
      updateData.payerId = validatedData.payerId;
    }

    // Handle split updates if amount or splitType changed
    if (
      validatedData.amount !== undefined ||
      validatedData.splitType !== undefined ||
      validatedData.participantIds !== undefined
    ) {
      const amount = validatedData.amount ?? Number(existingExpense.amount);
      const splitType = validatedData.splitType ?? existingExpense.splitType;
      const participantIds = validatedData.participantIds ?? 
        existingExpense.splits.map(s => s.participantId);

      // Calculate new splits
      const splits = calculateSplits(
        amount,
        splitType,
        participantIds,
        validatedData.customSplits,
        validatedData.percentageSplits
      );

      // Delete old splits and create new ones
      await prisma.expenseSplit.deleteMany({
        where: { expenseId: params.id },
      });

      updateData.amount = amount;
      updateData.splitType = splitType;
      updateData.splits = {
        create: splits.map(split => ({
          participantId: split.participantId,
          shareAmount: split.shareAmount,
        })),
      };
    }

    // Update expense
    const expense = await prisma.expense.update({
      where: { id: params.id },
      data: updateData,
      include: {
        payer: true,
        splits: {
          include: {
            participant: true,
          },
        },
      },
    });

    return NextResponse.json({ expense });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Update expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Delete an expense
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: {
        group: true,
      },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // Verify ownership
    if (expense.group.createdBy !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete expense (CASCADE will delete splits)
    await prisma.expense.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
