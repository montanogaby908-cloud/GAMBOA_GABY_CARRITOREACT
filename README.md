# 🛒 TIENDA PALMIRA – Carrito de Compras con Validaciones de Stock

Reto práctico de **Desarrollo Front-End con React** · SENA – CBI Palmira
Instructor: **Daniel Alfonso Martínez Payán**

| Dato | Valor |
|------|-------|
| **Aprendiz** | _(escriba aquí su nombre completo)_ |
| **Ficha** | _(escriba aquí el número de ficha)_ |
| **Tecnología usada** | ☑ React (Vite) ☐ HTML + CSS + JS |
| **Repositorio público** | https://github.com/montanogaby908-cloud/CARRITO_COMPRAS.git |

## ▶️ Instalar y ejecutar

Requisito: [Node.js](https://nodejs.org) 18 o superior.

```bash
git clone https://github.com/montanogaby908-cloud/CARRITO_COMPRAS.git
cd CARRITO_COMPRAS
npm install      # instala también las dependencias de /frontend
npm run dev      # abre http://localhost:5173
```

Otros comandos (desde la raíz):

| Comando | Qué hace |
|---------|----------|
| `npm test` | Ejecuta 16 pruebas automáticas (los 12 casos del instructor y más) |
| `npm run build` | Compila el frontend en `frontend/dist` |
| `npm start` | Compila y sirve la versión de producción en http://localhost:3000 |

## 📁 Estructura

```
CARRITO_COMPRAS/
├── README.md
├── package.json            # scripts de la raíz (install / dev / build / test)
├── backend/                # servidor estático: SIN base de datos y SIN API
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx        # punto de entrada de React
│       ├── app.jsx         # componente raíz
│       ├── data/           # productos.js (array JSON) e iconos.js
│       ├── hooks/          # useCarrito (reglas de stock) y useToasts
│       ├── components/     # Navbar, ProductCard, CartDrawer, CartItem, QuantityInput, ToastContainer
│       ├── utils/          # formatCOP y validación de cantidades
│       ├── styles/index.css
│       └── __tests__/      # pruebas automáticas
└── evidencias/             # capturas de pantalla
```

## ✅ Cómo cumple cada punto del reto

| Punto | Implementación |
|-------|----------------|
| 1. Catálogo JSON | `frontend/src/data/productos.js` con los 6 productos exactos del PDF (sin API ni BD) |
| 2. Navbar | Fija arriba; nombre a la izquierda, ícono del carrito a la derecha con contador (oculto en 0); el panel abre y cierra (botón X, clic fuera o `Esc`) |
| 3. Catálogo / Agregar | Nombre, precio, stock disponible, cantidad (inicia en 1) y **Agregar**; si ya existe se suma a la misma línea; sin stock el botón se deshabilita |
| 4. Campo numérico | `QuantityInput`: bloquea `e E + - . ,` y letras (`onKeyDown`), solo acepta pegar dígitos (`onPaste`), sanea `onChange` (teclados móviles), no acepta 0 ni negativos y la rueda del mouse no cambia el valor (`onWheel`) |
| 5. Stock máximo | Nunca se supera el stock al escribir, con **+** y al agregar de nuevo; se corrige al máximo y sale el toast *"Este es el máximo de producto disponible en stock"* |
| 6. Mínimo 1 | Con cantidad 1, **−** o escribir 0 no cambia nada y muestra un toast con botón **Sí, eliminar**; también hay botón de quitar directo. Los toasts desaparecen solos y se cierran con la X (sin `alert()`) |
| 7. Totales | Subtotal por línea, total de la compra y total de unidades, en formato COP (`$98.400`), actualizados al instante |
| 8. Repositorio | Público, con este README y la carpeta `evidencias/` |

### Decisiones técnicas
- El campo de cantidad es `type="text"` con `inputMode="numeric"`: así ningún navegador permite la `e` ni signos (el `type="number"` sí los deja escribir) y el teclado del celular es numérico.
- Mientras el usuario borra el campo para reescribir, se muestra vacío **sin** alterar el carrito, por eso los totales nunca dan `NaN`.
- El carrito se guarda en `localStorage` (valor agregado) y se revalida contra el stock al cargar.
- Accesibilidad: foco visible, `aria-label` en todos los botones y campos, toasts anunciados con `aria-live`, y animaciones desactivadas si el sistema pide menos movimiento.

## 🧪 Casos de prueba del instructor

Todos están automatizados en `frontend/src/__tests__/carrito.test.jsx` (`npm test`).

| # | Caso | Estado |
|---|------|--------|
| 1 | Teclear `e E + - . ,` no escribe nada | ✅ |
| 2 | Pegar `-5`, `3e2`, `abc` no se pega | ✅ |
| 3 | Escribir 0 en el catálogo: conserva el valor + toast de mínimo | ✅ |
| 4 | Escribir 0 en el carrito: no cambia + toast con opción de eliminar | ✅ |
| 5 | 999 con stock 8 → 8 + toast de máximo | ✅ |
| 6 | Panela: +2 y +2 → queda en 3 + toast | ✅ |
| 7 | **+** en el carrito con cantidad = stock → no sube + toast | ✅ |
| 8 | **−** con cantidad 1 → toast; al confirmar se elimina y se recalcula | ✅ |
| 9 | Agregar dos veces → una sola línea | ✅ |
| 10 | Café ×2, Panela ×3, Arepa ×1 → $57.000, $29.400, $12.000; total $98.400 | ✅ |
| 11 | Agotar Chocolate → botón deshabilitado | ✅ |
| 12 | Ícono a la derecha con contador de unidades | ✅ |

## 📸 Evidencias

Agregue las capturas en la carpeta [`evidencias/`](./evidencias) (nombres sugeridos en su README) y enlácelas aquí:

| # | Funcionalidad | Captura | ¿Funciona? |
|---|---------------|---------|------------|
| 1 | Navbar e ícono con contador | `evidencias/01-navbar-contador.png` | Sí |
| 2 | Agregar producto desde el catálogo | `evidencias/02-agregar-producto.png` | Sí |
| 3 | Bloqueo de la tecla "e" y de negativos / 0 | `evidencias/03-bloqueo-teclas.png` | Sí |
| 4 | Toast de stock máximo | `evidencias/04-toast-stock-maximo.png` | Sí |
| 5 | Toast de cantidad mínima con opción de eliminar | `evidencias/05-toast-minimo-eliminar.png` | Sí |
| 6 | Subtotales y total con varios productos | `evidencias/06-subtotales-total.png` | Sí |
| 7 | Producto eliminado y total recalculado | `evidencias/07-eliminado-recalculado.png` | Sí |

---
SENA – Servicio Nacional de Aprendizaje | CBI Palmira | Desarrollo Front-End con React
