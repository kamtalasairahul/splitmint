import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const updateGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').optional(),
});

// GET /api/groups/[id] - Get a specific group
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: {
        id: params.id,
        createdBy: user.userId,
      },
      include: {
        members: true,
        expenses: {
          include: {
            payer: true,
            splits: {
              include: {
                participant: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({ group });
  } catch (error) {
    console.error('Get group error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/groups/[id] - Update a group
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
    const validatedData = updateGroupSchema.parse(body);

    // Verify ownership
    const existingGroup = await prisma.group.findUnique({
      where: {
        id: params.id,
        createdBy: user.userId,
      },
    });

    if (!existingGroup) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const group = await prisma.group.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        members: true,
      },
    });

    return NextResponse.json({ group });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Update group error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id] - Delete a group
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const group = await prisma.group.findUnique({
      where: {
        id: params.id,
        createdBy: user.userId,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Delete group (CASCADE will delete members, expenses, and splits)
    await prisma.group.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
