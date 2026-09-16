import postgres from 'postgres';

const connectionString =
  process.env.DATABASE_URL || 'postgresql://ruru_user:ruru_pass123@localhost:5432/ruru_db';

declare global {
  // eslint-disable-next-line no-var
  var _sql: ReturnType<typeof postgres> | undefined;
}

export const sql = globalThis._sql || postgres(connectionString);

if (process.env.NODE_ENV !== 'production') {
  globalThis._sql = sql;
}

export default sql;
