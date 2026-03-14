// Requiere: npm install dotenv (y .env con DATABASE_URL)
// Prisma 7 requiere Node ^20.19 || ^22.12 || >=24 (ver package.json "engines")
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node --transpile-only prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
