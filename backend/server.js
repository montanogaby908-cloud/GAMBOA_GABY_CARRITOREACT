// Backend mínimo SIN base de datos y SIN API.
// El PDF exige que el catálogo viva como array JSON en el frontend, por eso este
// servidor solo entrega los archivos compilados del frontend (frontend/dist).
// Uso:  npm start   (compila el frontend y lo sirve en http://localhost:3000)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', 'frontend', 'dist');
const PUERTO = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function archivoPara(urlPath) {
  const limpio = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const ruta = join(RAIZ, limpio);
  if (ruta !== RAIZ && !ruta.startsWith(RAIZ + sep)) return null; // evita salir de /dist
  try {
    const info = await stat(ruta);
    return info.isFile() ? ruta : join(ruta, 'index.html');
  } catch {
    return join(RAIZ, 'index.html'); // la app es de una sola página
  }
}

createServer(async (req, res) => {
  try {
    const ruta = await archivoPara(req.url ?? '/');
    if (!ruta) {
      res.writeHead(403).end('Prohibido');
      return;
    }
    const contenido = await readFile(ruta);
    res.writeHead(200, { 'Content-Type': MIME[extname(ruta)] ?? 'application/octet-stream' });
    res.end(contenido);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No se encontró frontend/dist. Ejecute primero: npm run build');
  }
}).listen(PUERTO, () => console.log(`TIENDA PALMIRA lista en http://localhost:${PUERTO}`));
