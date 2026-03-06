# Pool timeout: la app no conecta a MySQL

Si ves **"pool timeout"** y **active=0 idle=0**, la app **no está llegando** al servidor MySQL. No es tema de contraseña ni de tiempo de espera.

## 1. ¿MySQL está corriendo?

En la terminal:

```bash
# ¿Está el proceso de MySQL?
ps aux | grep mysql
```

Si no aparece nada (o solo el propio `grep`), **MySQL no está encendido**.

- **Homebrew (Mac):** `brew services start mysql`
- **MAMP:** abre MAMP y pulsa "Start"
- **Windows:** Servicios → MySQL → Iniciar

## 2. ¿Escucha en el puerto 3306?

```bash
lsof -i :3306
```

Si no sale ninguna línea, MySQL **no está escuchando por TCP** en el puerto 3306. En muchos Mac con Homebrew, MySQL solo acepta conexiones por **socket**.

## 3. Probar conexión desde la terminal

```bash
mysql -u chasoft_user -p -h 127.0.0.1
```

- Si **entra**: MySQL está bien; el problema puede ser que la app use otro host/puerto o que haga falta usar socket.
- Si **no entra** (timeout o "Can't connect"): MySQL no está escuchando por TCP. Prueba sin `-h` para usar el socket por defecto:

```bash
mysql -u chasoft_user -p
```

Si **este sí entra**, MySQL está usando **solo socket**. Sigue el paso 4.

## 4. Usar socket en la app (Mac / MySQL solo socket)

En tu `.env` **comenta o quita** `DATABASE_HOST` y `DATABASE_PORT` para la conexión por socket y añade:

```env
DATABASE_SOCKET=/tmp/mysql.sock
```

En Mac con Homebrew el socket suele ser `/tmp/mysql.sock`. Si no existe:

```bash
# Buscar el socket
find /tmp /var -name "*.sock" 2>/dev/null | grep -i mysql
```

Reinicia la app (`npm run dev`) y prueba de nuevo.

## Resumen

| Síntoma | Qué hacer |
|--------|-----------|
| No hay proceso `mysql` | Iniciar MySQL (brew services, MAMP, etc.) |
| `lsof -i :3306` vacío | MySQL no usa puerto 3306 → probar por socket (paso 4) |
| `mysql -u user -p -h 127.0.0.1` falla pero `mysql -u user -p` entra | Añadir `DATABASE_SOCKET=/tmp/mysql.sock` en `.env` |
