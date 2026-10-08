import { useCallback, useEffect, useMemo, useState } from 'react';

export const MSG_STOCK_MAXIMO = 'Este es el máximo de producto disponible en stock';
const CLAVE_STORAGE = 'tienda-palmira:carrito';

// Carga el carrito guardado validando cada línea contra el catálogo
// (nunca se confía en lo guardado: se corrige a 1..stock).
function cargarCarrito(productos) {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE) ?? '[]');
    if (!Array.isArray(guardado)) return [];
    const vistos = new Set();
    return guardado.flatMap(({ id, cantidad }) => {
      const producto = productos.find((p) => p.id === id);
      const n = Number.isInteger(cantidad) ? cantidad : 0;
      if (!producto || n < 1 || vistos.has(id)) return [];
      vistos.add(id);
      return [{ id, cantidad: Math.min(n, producto.stock) }];
    });
  } catch {
    return [];
  }
}

/**
 * Lógica del carrito: líneas {id, cantidad}, totales y reglas de stock.
 * `notify` es la función de toasts de useToasts.
 */
export function useCarrito(productos, notify) {
  const [lineas, setLineas] = useState(() => cargarCarrito(productos));

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lineas));
    } catch {
      /* almacenamiento no disponible: el carrito sigue funcionando en memoria */
    }
  }, [lineas]);

  const porId = useMemo(() => new Map(productos.map((p) => [p.id, p])), [productos]);

  // Líneas enriquecidas con datos del producto y subtotal (precio × cantidad).
  const items = useMemo(
    () =>
      lineas.map((l) => {
        const p = porId.get(l.id);
        return { ...p, cantidad: l.cantidad, subtotal: p.precio * l.cantidad };
      }),
    [lineas, porId]
  );

  const totalUnidades = useMemo(() => items.reduce((s, i) => s + i.cantidad, 0), [items]);
  const totalCompra = useMemo(() => items.reduce((s, i) => s + i.subtotal, 0), [items]);

  const cantidadEnCarrito = useCallback(
    (id) => lineas.find((l) => l.id === id)?.cantidad ?? 0,
    [lineas]
  );

  const avisarMaximo = useCallback(
    (id) => notify(MSG_STOCK_MAXIMO, { type: 'warning', key: `max-${id}` }),
    [notify]
  );

  const fijarCantidad = useCallback(
    (id, cantidad) => setLineas((prev) => prev.map((l) => (l.id === id ? { ...l, cantidad } : l))),
    []
  );

  const quitar = useCallback(
    (id) => {
      const producto = porId.get(id);
      setLineas((prev) => prev.filter((l) => l.id !== id));
      if (producto) {
        notify(`Se quitó "${producto.nombre}" del carrito`, { type: 'info', key: `quitado-${id}` });
      }
    },
    [notify, porId]
  );

  // Con cantidad 1 no se baja: se pregunta si desea eliminar (toast con botón).
  const pedirEliminar = useCallback(
    (id) => {
      const producto = porId.get(id);
      notify(`Esta es la cantidad mínima (1). ¿Desea eliminar "${producto.nombre}" del carrito?`, {
        type: 'confirm',
        key: `min-carrito-${id}`,
        action: { label: 'Sí, eliminar', onClick: () => quitar(id) },
      });
    },
    [notify, porId, quitar]
  );

  /** Punto 3 y 5: agregar desde el catálogo sumando a la línea existente. */
  const agregar = useCallback(
    (id, cantidad) => {
      const producto = porId.get(id);
      const enCarrito = cantidadEnCarrito(id);
      const disponible = producto.stock - enCarrito;
      const pedida = Math.max(1, Number(cantidad) || 1);

      if (disponible <= 0) {
        avisarMaximo(id);
        return;
      }
      const aAgregar = Math.min(pedida, disponible);

      setLineas((prev) =>
        prev.some((l) => l.id === id)
          ? prev.map((l) => (l.id === id ? { ...l, cantidad: l.cantidad + aAgregar } : l))
          : [...prev, { id, cantidad: aAgregar }]
      );

      if (pedida > disponible) {
        avisarMaximo(id);
      } else {
        notify(`${aAgregar} × ${producto.nombre} agregado al carrito`, { type: 'success', key: `agregado-${id}` });
      }
    },
    [avisarMaximo, cantidadEnCarrito, notify, porId]
  );

  const incrementar = useCallback(
    (id) => {
      const producto = porId.get(id);
      const actual = cantidadEnCarrito(id);
      if (actual >= producto.stock) return avisarMaximo(id);
      fijarCantidad(id, actual + 1);
    },
    [avisarMaximo, cantidadEnCarrito, fijarCantidad, porId]
  );

  const decrementar = useCallback(
    (id) => {
      const actual = cantidadEnCarrito(id);
      if (actual <= 1) return pedirEliminar(id);
      fijarCantidad(id, actual - 1);
    },
    [cantidadEnCarrito, fijarCantidad, pedirEliminar]
  );

  /** Cantidad escrita a mano dentro del carrito. Solo recibe enteros >= 0. */
  const cambiarCantidad = useCallback(
    (id, nueva) => {
      const producto = porId.get(id);
      if (nueva < 1) return pedirEliminar(id); // 0: la cantidad no cambia
      if (nueva > producto.stock) {
        fijarCantidad(id, producto.stock);
        return avisarMaximo(id);
      }
      fijarCantidad(id, nueva);
    },
    [avisarMaximo, fijarCantidad, pedirEliminar, porId]
  );

  const vaciar = useCallback(() => setLineas([]), []);

  return {
    items,
    totalUnidades,
    totalCompra,
    cantidadEnCarrito,
    agregar,
    incrementar,
    decrementar,
    cambiarCantidad,
    quitar,
    vaciar,
    avisarMaximo,
  };
}
