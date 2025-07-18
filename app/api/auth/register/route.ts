// app/api/auth/register/route.js
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {

  try {

    const { name, email, password } = await req.json();

    // Input validation
    if (!name || !email || !password) {

      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (password.length < 8) {

      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters long' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[REGISTER] POST request:', { name, email, password });
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      console.log('Existing user check:', existingUser);
    
      if (existingUser.rows.length > 0) {
    
        return new Response(JSON.stringify({ error: 'Email already registered' }), { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];

    return new Response(JSON.stringify({ 
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Server error during registration' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}