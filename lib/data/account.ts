// lib/db.server.ts
import { Pool, QueryResult } from 'pg';
import bcrypt from 'bcryptjs';

// Define types for our user data
export interface User {
  id: string | number;
  name: string;
  email: string;
  created_at?: Date;
}

export interface UserWithPassword extends User {
  hashedPassword: string;
}

export interface SocialAccount {
  id: string | number;
  user_id: string | number;
  provider: string;
  provider_account_id: string;
  access_token?: string;
  created_at: Date;
}

export interface CreateUserData {
  name?: string;
  email: string;
}

export interface CreateUserWithPasswordData {
  name: string;
  email: string;
  plainTextPassword: string;
}

// Initialize the database connection pool
// It's good practice to ensure DATABASE_URL is set in your environment variables
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Optional: SSL configuration for production databases (e.g., on Vercel, Heroku)
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Retrieves all social accounts linked to a specific user.
 * @param {string | number} userId - The ID of the user.
 * @returns {Promise<Array<SocialAccount>>} A promise that resolves to an array of social account objects.
 * @throws Will throw an error if the query fails.
 */
export async function getUserSocialAccounts(userId: string | number): Promise<SocialAccount[]> {
  try {
    console.log(`Fetching social accounts for userId: ${userId}`);
    const result: QueryResult<SocialAccount> = await pool.query(
      'SELECT id, user_id, provider, provider_account_id, created_at FROM social_accounts WHERE user_id = $1',
      [userId]
    );
    console.log(`Found ${result.rows.length} social accounts for userId: ${userId}`);
    return result.rows;
  } catch (error) {
    console.error('Error getting user social accounts:', error instanceof Error ? error.message : error, 
                  error instanceof Error ? error.stack : '');
    throw new Error('Could not retrieve social accounts.'); // Throw a more generic error to the caller
  }
}

/**
 * Creates a new user in the database without a password (e.g., for social sign-ups initially).
 * @param {CreateUserData} userData - Object containing user details.
 * @returns {Promise<string | number>} A promise that resolves to the ID of the newly created user.
 * @throws Will throw an error if the query fails or email is missing.
 */
export async function createUser(userData: CreateUserData): Promise<string | number> {
  const { email, name } = userData;
  if (!email) {
    throw new Error('Email is required to create a user.');
  }
  try {
    console.log(`Creating user with email: ${email}`);
    const result = await pool.query<{ id: string | number }>(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id',
      [email, name]
    );
    const userId = result.rows[0].id;
    console.log(`User created successfully with ID: ${userId}`);
    return userId;
  } catch (error) {
    console.error('Error creating user:', error instanceof Error ? error.message : error, 
                  error instanceof Error ? error.stack : '');
    if (error instanceof Error && 'code' in error && error.code === '23505') { // Unique violation (e.g., email already exists)
      throw new Error('A user with this email already exists.');
    }
    throw new Error('Could not create user.');
  }
}

/**
 * Creates a new user with a hashed password.
 * @param {CreateUserWithPasswordData} userData - User data.
 * @returns {Promise<User>} A promise that resolves to the new user object (id, name, email).
 * @throws Will throw an error if input is invalid or database operation fails.
 */
export async function createUserWithPassword(userData: CreateUserWithPasswordData): Promise<User> {
  const { name, email, plainTextPassword } = userData;

  // Input validation
  if (!name || !email || !plainTextPassword) {
    throw new Error('Missing required fields (name, email, password).');
  }
  if (plainTextPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('Email already registered.');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

    // Insert new user
    console.log(`Creating user with password for email: ${email}`);
    const result = await pool.query<User>(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    const newUser = result.rows[0];
    console.log(`User with password created successfully for ID: ${newUser.id}`);
    return newUser;
  } catch (error) {
    console.error('Error creating user with password:', error instanceof Error ? error.message : error, 
                  error instanceof Error ? error.stack : '');
    if (error instanceof Error && error.message === 'Email already registered.') throw error; // Re-throw specific known errors
    throw new Error('Server error during user creation with password.');
  }
}

/**
 * Updates the password for an existing user.
 * @param {string | number} userId - The ID of the user to update.
 * @param {string} newPlainTextPassword - The new plain text password.
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful.
 * @throws Will throw an error if input is invalid or database operation fails.
 */
export async function updateUserPassword(userId: string | number, newPlainTextPassword: string): Promise<boolean> {
  if (!userId || !newPlainTextPassword) {
    throw new Error('User ID and new password are required.');
  }
  if (newPlainTextPassword.length < 8) {
    throw new Error('New password must be at least 8 characters long.');
  }

  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPlainTextPassword, salt);

    console.log(`Updating password for userId: ${userId}`);
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
      [hashedPassword, userId]
    );

    if (result.rowCount === 0) {
      throw new Error('User not found or password could not be updated.');
    }
    console.log(`Password updated successfully for userId: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating user password:', error instanceof Error ? error.message : error, 
                  error instanceof Error ? error.stack : '');
    if (error instanceof Error && error.message.startsWith('User not found')) throw error;
    throw new Error('Server error during password update.');
  }
}

/**
 * Verifies a user's password.
 * @param {string} email - The user's email.
 * @param {string} plainTextPassword - The plain text password to verify.
 * @returns {Promise<User|null>} User object (id, name, email) if password is correct, otherwise null.
 * @throws Will throw an error if database operation fails.
 */
export async function verifyUserPassword(email: string, plainTextPassword: string): Promise<User | null> {
  if (!email || !plainTextPassword) {
    throw new Error('Email and password are required for verification.');
  }
  try {
    console.log(`Attempting to verify password for email: ${email}`);
    const result = await pool.query<UserWithPassword>(
      'SELECT id, name, email, password AS "hashedPassword" FROM users WHERE email = $1', 
      [email]
    );
    if (result.rows.length === 0) {
      console.log(`No user found with email: ${email}`);
      return null; // User not found
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(plainTextPassword, user.hashedPassword);

    if (isMatch) {
      console.log(`Password verified for user ID: ${user.id}`);
      // Return user data but remove the hashed password before sending it back
      const { hashedPassword, ...userData } = user;
      return userData;
    } else {
      console.log(`Password mismatch for user ID: ${user.id}`);
      return null; // Passwords do not match
    }
  } catch (error) {
    console.error('Error verifying user password:', error instanceof Error ? error.message : error, 
                  error instanceof Error ? error.stack : '');
    throw new Error('Server error during password verification.');
  }
}

/**
 * Finds a user by their email address.
 * @param {string} email - The email address to search for.
 * @returns {Promise<User | undefined>} A promise that resolves to the user object if found, otherwise undefined.
 * @throws Will throw an error if the query fails.
 */
export async function findUserByEmail(email: string): Promise<User | undefined> {
  if (!email) {
    throw new Error('Email is required to find a user.');
  }
  try {
    console.log(`Finding user by email: ${email}`);
    const result = await pool.query<User>(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length > 0) {
      console.log(`User found with ID: ${result.rows[0].id}`);
      return result.rows[0]; // Return the user object
    }
    console.log(`No user found with email: ${email}`);
    return undefined;
  } catch (error) {
    console.error('Error finding user by email:', error instanceof Error ? error.message : error, 
                  error instanceof Error ? error.stack : '');
    throw new Error('Could not find user by email.');
  }
}

/**
 * Links a social media account to an existing user.
 * @param {string | number} userId - The ID of the user.
 * @param {string} provider - The name of the social provider (e.g., 'google', 'facebook').
 * @param {string} providerAccountId - The user's ID from the social provider.
 * @param {string} [accessToken] - The access token from the social provider (optional, store if needed).
 * @returns {Promise<string | number>} A promise that resolves to the ID of the newly linked social account.
 * @throws Will throw an error if the query fails or required fields are missing.
 */
export async function linkSocialAccount(
  userId: string | number, 
  provider: string, 
  providerAccountId: string, 
  accessToken?: string
): Promise<string | number> {
  if (!userId || !provider || !providerAccountId) {
    throw new Error('User ID, provider, and provider account ID are required to link a social account.');
  }
  try {
    console.log(`Linking ${provider} account for userId: ${userId}`);
    const result = await pool.query<{ id: string | number }>(
      'INSERT INTO social_accounts (user_id, provider, provider_account_id, access_token) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, provider, providerAccountId, accessToken] // accessToken can be null/undefined
    );
    const socialAccountId = result.rows[0].id;
    console.log(`${provider} account linked successfully with ID: ${socialAccountId}`);
    return socialAccountId;
  } catch (error) {
    console.error('Error linking social account:', error instanceof Error ? error.message : error, 
                  error instanceof Error ? error.stack : '');
    if (error instanceof Error && 'code' in error) {
      if (error.code === '23505') { // Unique violation
        throw new Error(`This ${provider} account is already linked to a user.`);
      } else if (error.code === '23503') { // Foreign key violation
        throw new Error('User not found to link social account.');
      }
    }
    throw new Error('Could not link social account.');
  }
}

/**
 * Finds a user by their ID.
 * @param {string | number} userId - The ID of the user.
 * @returns {Promise<User | undefined>} A promise that resolves to the user object if found, otherwise undefined.
 * @throws Will throw an error if the query fails.
 */
export async function findUserById(userId: string | number): Promise<User | undefined> {
  if (!userId) {
    throw new Error('User ID is required.');
  }
  try {
    console.log(`Finding user by ID: ${userId}`);
    const result = await pool.query<User>(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return undefined; // User not found
  } catch (error) {
    console.error('Error finding user by ID:', error instanceof Error ? error.message : error, 
                  error instanceof Error ? error.stack : '');
    throw new Error('Could not find user by ID.');
  }
}