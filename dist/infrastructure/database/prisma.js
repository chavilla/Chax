"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
require("dotenv/config");
const connectionUrl = process.env.DATABASE_URL;
if (!connectionUrl) {
    throw new Error('DATABASE_URL no está definida. Copia .env.example a .env y configura la conexión a la base de datos.');
}
// Si MySQL solo acepta conexión por socket (común en Mac), pon en .env: DATABASE_SOCKET=/tmp/mysql.sock
const socketPath = process.env.DATABASE_SOCKET;
const dbConfig = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectTimeout: 30_000,
    acquireTimeout: 30_000,
};
if (socketPath) {
    dbConfig.socketPath = socketPath;
}
else {
    dbConfig.host = process.env.DATABASE_HOST || 'localhost';
    dbConfig.port = parseInt(process.env.DATABASE_PORT || '3306', 10);
}
const adapter = new adapter_mariadb_1.PrismaMariaDb(dbConfig);
exports.prisma = new client_1.PrismaClient({ adapter });
