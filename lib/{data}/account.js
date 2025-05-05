// lib/data/accounts.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function createUser({ email, name }) {
  try {
    const result = await pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id',
      [email, name]
    );
    return result.rows[0]?.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function linkSocialAccount({ userId, provider, providerAccountId, accessToken, refreshToken, expiresAt }) {
  try {
    await pool.query(
      'INSERT INTO social_accounts (user_id, provider, provider_account_id, access_token, refresh_token, expires_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (provider, provider_account_id) DO UPDATE SET user_id = $1, access_token = $4, refresh_token = $5, expires_at = $6, updated_at = NOW()',
      [userId, provider, providerAccountId, accessToken, refreshToken, expiresAt]
    );
  } catch (error) {
    console.error('Error linking social account:', error);
    throw error;
  }
}

export async function findUserByEmail(email) {
  try {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    return result.rows[0]?.id;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

export async function getUserSocialAccounts(userId) {
  try {
    const result = await pool.query('SELECT provider, provider_account_id FROM social_accounts WHERE user_id = $1', [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting user social accounts:', error);
    throw error;
  }
}

// Add more database interaction functions as needed