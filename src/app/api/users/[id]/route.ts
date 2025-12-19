import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePasswordStrength } from '@/lib/password';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id] - Get user details
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Users can only view their own profile unless admin
    if (session.user.role !== 'ADMIN' && session.user.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        phone: true,
        title: true,
        firmId: true,
        clientId: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        firm: {
          select: { id: true, name: true, slug: true },
        },
        client: {
          select: { id: true, name: true },
        },
        managedClients: {
          select: {
            id: true,
            isPrimary: true,
            client: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update user
const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['ADMIN', 'ATTORNEY', 'CLIENT']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
  phone: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  firmId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
});

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Users can update their own profile (limited fields), admins can update anyone
    const isOwnProfile = session.user.id === id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Non-admins can only update limited fields
    if (!isAdmin) {
      const allowedFields = ['name', 'phone', 'avatar', 'password'];
      const attemptedFields = Object.keys(data);
      const forbiddenFields = attemptedFields.filter(
        (f) => !allowedFields.includes(f)
      );

      if (forbiddenFields.length > 0) {
        return NextResponse.json(
          { error: `Cannot update: ${forbiddenFields.join(', ')}` },
          { status: 403 }
        );
      }
    }

    // If password is being updated, validate and hash it
    let updateData: Record<string, unknown> = { ...data };
    if (data.password) {
      const passwordValidation = validatePasswordStrength(data.password);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { error: passwordValidation.errors[0] },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(data.password);
      delete updateData.password;
    }

    // If email is being updated, check for duplicates
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email.toLowerCase(),
          id: { not: id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
      updateData.email = data.email.toLowerCase();
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        phone: true,
        title: true,
        firmId: true,
        clientId: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Deactivate user (Admin only)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    // Prevent self-deactivation
    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    // Soft delete - set status to INACTIVE
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    return NextResponse.json({
      message: 'User deactivated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate user' },
      { status: 500 }
    );
  }
}
