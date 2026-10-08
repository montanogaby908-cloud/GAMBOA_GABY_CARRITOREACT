# Backend

Servidor Node **sin dependencias, sin base de datos y sin API**.

El reto exige que el catálogo sea un *array JSON escrito en el frontend*
(`frontend/src/data/productos.js`), por eso el backend **no expone datos**: solo
sirve los archivos compilados de `frontend/dist` (útil para probar la versión de producción).

```bash
npm start        # desde la raíz: compila el frontend y lo sirve en http://localhost:3000
```
