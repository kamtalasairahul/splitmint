import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const addMemberSchema = z.object({
  name: z.string().min(1, 'Member name is required'),
  avatarColor: z.string().optional(),
});

const updateMemberSchema = z.object({
  name: z.string().min(1, 'Member name is required').optional(),
  avatarColor: z.string().optional(),
});

// POST /api/groups/[id]/members - Add a member to a group
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = addMemberSchema.parse(body);

    // Verify group ownership
    const group = await prisma.group.findUnique({
      where: {
        id: params.id,
        createdBy: user.userId,
      },
      include: {
        members: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Check member limit (4 total including primary user)
    if (group.members.length >= 4) {
      return NextResponse.json(
        { error: 'Maximum 4 members allowed per group' },
        { status: 400 }
      );
    }

    // Add member
    const member = await prisma.groupMember.create({
      data: {
        groupId: params.id,
        name: validatedData.name,
        avatarColor: validatedData.avatarColor || generateRandomColor(),
        isPrimaryUser: false,
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Add member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/groups/[id]/members/[memberId] - Update a member
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
    const { memberId, ...updateData } = body;
    const validatedData = updateMemberSchema.parse(updateData);

    // Verify group ownership
    const group = await prisma.group.findUnique({
      where: {
        id: params.id,
        createdBy: user.userId,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Update member
    const member = await prisma.groupMember.update({
      where: {
        id: memberId,
        groupId: params.id,
      },
      data: validatedData,
    });

    return NextResponse.json({ member });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Update member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id]/members/[memberId] - Remove a member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Verify group ownership
    const group = await prisma.group.findUnique({
      where: {
        id: params.id,
        createdBy: user.userId,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Check if member is primary user
    const member = await prisma.groupMember.findUnique({
      where: { id: memberId },
    });

    if (member?.isPrimaryUser) {
      return NextResponse.json(
        { error: 'Cannot remove primary user' },
        { status: 400 }
      );
    }

    // Check if member has expenses
    const expenseCount = await prisma.expense.count({
      where: {
        OR: [
          { payerId: memberId },
          { splits: { some: { participantId: memberId } } },
        ],
      },
    });

    if (expenseCount > 0) {
      return NextResponse.json(
        { error: 'Cannot remove member with existing expenses. Delete expenses first.' },
        { status: 400 }
      );
    }

    // Delete member
    await prisma.groupMember.delete({
      where: { id: memberId },
    });

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateRandomColor(): string {
  const colors = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // emerald
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
