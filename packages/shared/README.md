# @chax/shared

Paquete compartido del monorepo Chax. Contiene tipos, constantes, enums y schemas reutilizables entre **API** y **Web**.

## Contenido

- **`constants/api-routes`** – Rutas base de la API (`API_ROUTES`) para construir URLs.
- **`enums`** – Enums alineados con Prisma: `UserRole`, `IdType`, `TaxRegime`, `TaxType`, `InvoiceType`, `DianStatus`, `PaymentStatus`, `PaymentMethod`, `StockMovementType`, `ExpenseCategory`.
- **`types/api`** – Tipos genéricos: `ApiResponse<T>`, `ApiErrorResponse`, `PaginationMeta`, `PaginatedResponse<T>`, `PaginationParams`.
- **`schemas/common`** – Schemas Zod: `uuidSchema`, `paginationQuerySchema`, `organizationIdQuerySchema`.

## Uso

### En la API

```ts
import { API_ROUTES, TaxType, uuidSchema, type PaginatedResponse } from '@chax/shared';
```

### En la Web

```ts
import { API_ROUTES, PaymentMethod, type ApiResponse } from '@chax/shared';

const url = `${process.env.NEXT_PUBLIC_API_URL}${API_ROUTES.PRODUCTS}`;
```

## Build

Desde la raíz del monorepo:

```bash
npm run build:shared
```

Antes de levantar la API o la Web por primera vez, compila el shared para generar `dist/`.
