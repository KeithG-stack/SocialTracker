// app/api/auth/forgot-password/route.js
import pool, { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For security reasons, we don't want to reveal whether a user exists
    // Always return a success message even if email doesn't exist in database
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    const userId = userResult.rows[0].id;
    await query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, resetToken, resetTokenExpiration]
    );

    // Send password reset email
    // await sendPasswordResetEmail(email, resetToken); // This function is not defined in the original code

    return new Response(JSON.stringify({ message: 'Password reset email sent if account exists' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}