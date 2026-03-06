/**
 * Diagnóstico de conexión a MySQL (sin depender del driver mariadb).
 * Ejecutar: node scripts/test-db-connection.mjs
 */
import 'dotenv/config';
import net from 'net';
import fs from 'fs';

const host = process.env.DATABASE_HOST || '127.0.0.1';
const port = parseInt(process.env.DATABASE_PORT || '3306', 10);
const socketPath = process.env.DATABASE_SOCKET;

console.log('Configuración .env:');
console.log('  DATABASE_HOST:', process.env.DATABASE_HOST || '(no definido, usa 127.0.0.1)');
console.log('  DATABASE_PORT:', process.env.DATABASE_PORT || '(no definido, usa 3306)');
console.log('  DATABASE_SOCKET:', process.env.DATABASE_SOCKET || '(no definido)');
console.log('  DATABASE_USER:', process.env.DATABASE_USER);
console.log('  DATABASE_NAME:', process.env.DATABASE_NAME);
console.log('---');

function testTcp(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve({ ok: false, error: 'Timeout (5s). Nadie responde en ' + host + ':' + port });
    }, 5000);
    socket.connect(port, host, () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve({ ok: true });
    });
    socket.on('error', (err) => {
      clearTimeout(timeout);
      resolve({ ok: false, error: err.code || err.message });
    });
  });
}

function testSocket(path) {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) return resolve({ ok: false, error: 'Socket no existe: ' + path });
    });
    const socket = new net.Socket();
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve({ ok: false, error: 'Timeout (5s). MySQL no responde en el socket.' });
    }, 5000);
    socket.connect({ path }, () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve({ ok: true });
    });
    socket.on('error', (err) => {
      clearTimeout(timeout);
      resolve({ ok: false, error: err.code || err.message });
    });
  });
}

async function main() {
  if (socketPath) {
    console.log('Probando SOCKET:', socketPath);
    const result = await testSocket(socketPath);
    if (result.ok) {
      console.log('OK: Hay algo escuchando en el socket. La app debería poder conectar.');
      console.log('Si la app sigue fallando, el problema puede ser usuario/contraseña o que Prisma no use bien el socket.');
    } else {
      console.log('FALLO:', result.error);
      console.log('Solución: quita DATABASE_SOCKET del .env o usa la ruta correcta del socket de MySQL.');
    }
  } else {
    console.log('Probando TCP:', host + ':' + port);
    const result = await testTcp(host, port);
    if (result.ok) {
      console.log('OK: Hay algo escuchando en el puerto. La app debería poder conectar.');
      console.log('Si la app sigue fallando, revisa usuario y contraseña en .env');
    } else {
      console.log('FALLO:', result.error);
      if (result.error === 'ECONNREFUSED') {
        console.log('');
        console.log('MySQL NO está escuchando en ' + host + ':' + port + '.');
        console.log('  - Enciende MySQL (ej: brew services start mysql)');
        console.log('  - O si MySQL usa solo socket, en .env añade:');
        console.log('    DATABASE_SOCKET=/tmp/mysql.sock');
        console.log('    (en Mac/Homebrew suele ser /tmp/mysql.sock)');
      }
    }
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
