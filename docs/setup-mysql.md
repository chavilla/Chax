# Crear usuario y base de datos en MySQL

Sigue estos pasos **una sola vez** para tener un usuario y una base de datos para Chasoft.

## Opción 1: Desde la terminal (recomendado)

### 1. Entrar a MySQL como root

```bash
# Si instalaste MySQL con Homebrew (macOS):
mysql -u root

# Si te pide contraseña (la configuraste al instalar):
mysql -u root -p
```

### 2. Ejecutar estos comandos SQL

Copia y pega en la consola de MySQL (cambia `chasoft_user` y `tu_contraseña_segura` por los que quieras):

```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS chasoft
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Crear usuario y darle acceso solo a esa base
CREATE USER IF NOT EXISTS 'chasoft_user'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';

-- Dar todos los permisos sobre la base chasoft
GRANT ALL PRIVILEGES ON chasoft.* TO 'chasoft_user'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Salir
EXIT;
```

### 3. Configurar tu .env

En tu archivo `.env`:

```
DATABASE_URL="mysql://chasoft_user:tu_contraseña_segura@localhost:3306/chasoft"
```

Sustituye `tu_contraseña_segura` por la misma contraseña que usaste en el `IDENTIFIED BY`.

---

## Opción 2: Todo en una línea desde la terminal

Sin abrir el cliente MySQL, puedes ejecutar:

```bash
mysql -u root -e "
  CREATE DATABASE IF NOT EXISTS chasoft CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'chasoft_user'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
  GRANT ALL PRIVILEGES ON chasoft.* TO 'chasoft_user'@'localhost';
  FLUSH PRIVILEGES;
"
```

Si root tiene contraseña:

```bash
mysql -u root -p -e "..."   # te pedirá la contraseña de root
```

Luego configura `DATABASE_URL` en `.env` como en el paso 3 anterior.

---

## Si no tienes MySQL instalado (macOS)

```bash
brew install mysql
brew services start mysql
```

La primera vez, `root` no suele tener contraseña. Después de instalar puedes crear el usuario y la base con la Opción 1 o 2.

---

## Resumen

| Qué            | Valor de ejemplo        |
|----------------|-------------------------|
| Base de datos  | `chasoft`               |
| Usuario        | `chasoft_user`          |
| Contraseña     | La que elijas           |
| DATABASE_URL   | `mysql://chasoft_user:CONTRASEÑA@localhost:3306/chasoft` |

Si tu contraseña tiene caracteres especiales (`@`, `#`, `%`, `/`), en la URL debes codificarlos (por ejemplo `@` → `%40`).
