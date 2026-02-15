import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  members: z.array(z.object({
    name: z.string().min(1),
    avatarColor: z.string().optional(),
  })).max(3, 'Maximum 3 additional members allowed'),
});

// GET /api/groups - Get all groups for the authenticated user
export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groups = await prisma.group.findMany({
      where: {
        createdBy: user.userId,
      },
      include: {
        members: true,
        _count: {
          select: {
            expenses: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Get groups error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/groups - Create a new group
export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createGroupSchema.parse(body);

    // Get user details
    const userDetails = await prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!userDetails) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create group with members
    const group = await prisma.group.create({
      data: {
        name: validatedData.name,
        createdBy: user.userId,
        members: {
          create: [
            {
              userId: user.userId,
              name: userDetails.name,
              isPrimaryUser: true,
              avatarColor: '#3B82F6',
            },
            ...validatedData.members.map(member => ({
              name: member.name,
              avatarColor: member.avatarColor || generateRandomColor(),
              isPrimaryUser: false,
            })),
          ],
        },
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Create group error:', error);
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
