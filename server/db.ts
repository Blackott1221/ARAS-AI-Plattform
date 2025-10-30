import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment');
}

// Mit Retry-Logic für bessere Stabilität
const client = postgres(connectionString, {
  idle_timeout: 20,
  max_lifetime: 60 * 5,
  connect_timeout: 10,
});

export const db = drizzle(client);
