import path from 'path';
// PrismaClient es el único import necesario de @prisma/client; ejecuta `npm run db:generate` para generarlo
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import dotenv from 'dotenv';

// Cargar .env desde la raíz de apps/api (funciona con npm workspaces desde raíz del monorepo)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const connectionUrl = process.env.DATABASE_URL;
if (!connectionUrl) {
  throw new Error(
    'DATABASE_URL no está definida. Copia .env.example a .env y configura la conexión a la base de datos.'
  );
}

// Si MySQL solo acepta conexión por socket (común en Mac), pon en .env: DATABASE_SOCKET=/tmp/mysql.sock
const socketPath = process.env.DATABASE_SOCKET;

const dbConfig: Record<string, unknown> = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectTimeout: 30_000,
  acquireTimeout: 30_000,
};

if (socketPath) {
  dbConfig.socketPath = socketPath;
} else {
  dbConfig.host = process.env.DATABASE_HOST || 'localhost';
  dbConfig.port = parseInt(process.env.DATABASE_PORT || '3306', 10);
}

const adapter = new PrismaMariaDb(dbConfig);
export const prisma = new PrismaClient({ adapter });

/** Tipo del cliente de transacción (sin $connect, $transaction, etc.) para no depender de importar PrismaClient */
export type TxClient = Omit<
  typeof prisma,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
