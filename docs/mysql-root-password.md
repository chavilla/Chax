# Acceder a MySQL cuando no recuerdas o no tienes contraseña de root

## 1. Probar sin contraseña

En muchas instalaciones (sobre todo con Homebrew en Mac), **root no tiene contraseña** al inicio.

Prueba **sin** `-p`:

```bash
mysql -u root
```

Si pide contraseña, en la terminal a veces se usa **Enter** (contraseña vacía).

---

## 2. Si instalaste con Homebrew (macOS)

Homebrew suele dejar a `root` sin contraseña. Si aun así no entra:

```bash
# Ver si MySQL está corriendo
brew services list

# Reiniciar MySQL
brew services restart mysql
```

Luego intenta de nuevo:

```bash
mysql -u root
```

---

## 3. Resetear la contraseña de root (si la olvidaste)

### Con Homebrew (macOS)

**Paso 1 – Detener MySQL**

```bash
brew services stop mysql
```

**Paso 2 – Arrancar MySQL sin permisos (modo seguro)**

```bash
mysqld_safe --skip-grant-tables &
```

Espera unos segundos hasta que arranque.

**Paso 3 – Entrar sin contraseña**

```bash
mysql -u root
```

**Paso 4 – Dentro de MySQL, cambiar la contraseña**

En MySQL 5.7 y anteriores:

```sql
FLUSH PRIVILEGES;
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('nueva_contraseña');
FLUSH PRIVILEGES;
EXIT;
```

En MySQL 8+:

```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nueva_contraseña';
FLUSH PRIVILEGES;
EXIT;
```

**Paso 5 – Cerrar MySQL en modo seguro y volver a iniciar normal**

```bash
# Buscar el proceso
ps aux | grep mysqld

# Matar el proceso de mysqld_safe (usa el PID que te muestre)
kill -9 <PID_de_mysqld_safe>

# Iniciar MySQL normal
brew services start mysql
```

**Paso 6 – Probar**

```bash
mysql -u root -p
# Contraseña: nueva_contraseña
```

---

## 4. Si usas MAMP, XAMPP, instalador oficial, etc.

- **MAMP**: usuario `root`, contraseña `root`, o a veces vacía.
- **XAMPP**: suele ser `root` sin contraseña.
- **Instalador oficial de MySQL**: en la instalación te pide definir la contraseña de root; si no la recuerdas, toca resetear como en la sección 3 (ruta de `mysqld_safe` y pasos pueden cambiar según tu instalación).

---

## Resumen rápido

| Situación              | Qué probar primero        |
|------------------------|---------------------------|
| No recuerdo si puse pwd | `mysql -u root` (sin `-p`) |
| Homebrew, recién instalado | `mysql -u root`           |
| Contraseña incorrecta  | Resetear como en sección 3 |

Cuando consigas entrar con `mysql -u root` (o `mysql -u root -p` y la nueva contraseña), puedes seguir con los pasos de `docs/setup-mysql.md` para crear el usuario `chasoft_user` y la base `chasoft`.
