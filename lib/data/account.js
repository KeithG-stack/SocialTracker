import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getUserSocialAccounts(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM social_accounts WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting user social accounts:', error);
    throw error;
  }
}

export async function createUser(userData) {
  try {
    const result = await pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id',
      [userData.email, userData.name]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function findUserByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0]?.id;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

export async function linkSocialAccount(userId, provider, providerAccountId, accessToken) {
  try {
    const result = await pool.query(
      'INSERT INTO social_accounts (user_id, provider, provider_account_id, access_token) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, provider, providerAccountId, accessToken]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('Error linking social account:', error);
    throw error;
  }
}
