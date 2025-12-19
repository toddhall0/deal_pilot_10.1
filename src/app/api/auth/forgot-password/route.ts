import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateResetToken, getTokenExpiration } from '@/lib/password';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new token
    const token = generateResetToken();
    const expires = getTokenExpiration(1); // 1 hour

    // Save token
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      },
    });

    // TODO: Send email with reset link
    // For now, log the token in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Password reset token for ${email}: ${token}`);
      console.log(`Reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`);
    }

    // In production, you would send an email here
    // await sendPasswordResetEmail(user.email, token);

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
