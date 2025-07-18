// app/api/auth/forgot-password/route.ts
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (userResult.length === 0) {
      // For security, don't reveal if email exists
      return NextResponse.json({ 
        message: 'Password reset email sent if account exists' 
      }, { status: 200 });
    }

    const user = userResult[0];
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now

    // Delete any existing reset tokens for this user
    await sql`
      DELETE FROM password_reset_tokens 
      WHERE user_id = ${user.id}
    `;

    // Store new reset token in database
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at) 
      VALUES (${user.id}, ${resetToken}, ${resetTokenExpiration})
    `;

    // TODO: Send password reset email
    // await sendPasswordResetEmail(email, resetToken);
    
    console.log(`Password reset token for ${email}: ${resetToken}`); // Remove in production

    return NextResponse.json({ 
      message: 'Password reset email sent if account exists' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}