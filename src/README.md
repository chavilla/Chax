# Estructura del proyecto (Clean Architecture)

```
src/
├── shared/                    # Código compartido entre módulos
│   ├── core/                  # Bases (Entity, UseCase)
│   ├── domain/                # Puertos compartidos (ej. DatabaseRepository)
│   ├── application/           # Casos de uso compartidos (ej. CheckHealthUseCase)
│   ├── errors/
│   └── middlewares/
│
├── modules/                   # Módulos de negocio (cada uno autocontenido)
│   └── organization/
│       ├── domain/            # Entidades e interfaces de repositorio
│       ├── useCases/          # Casos de uso del módulo
│       ├── controllers/
│       ├── routes/
│       ├── repositories/      # Implementaciones (Prisma, etc.)
│       └── dtos/
│
└── infrastructure/            # Adaptadores externos
    ├── http/                  # Express: server, rutas, controladores HTTP
    └── database/              # Prisma client e implementaciones de repositorios compartidos
```

- **shared**: kernel compartido (dominio, aplicación e infra compartidos como health).
- **modules**: cada módulo sigue Clean Architecture (domain → useCases → controllers/routes; repositorios como adaptadores).
- **infrastructure**: arranque del servidor, registro de rutas y acceso a base de datos.
