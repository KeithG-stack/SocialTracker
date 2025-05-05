import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.POSTGRES_URL!, {
  fetchOptions: {
    cache: 'no-store',
  },
});

export const db = drizzle(sql, { schema });