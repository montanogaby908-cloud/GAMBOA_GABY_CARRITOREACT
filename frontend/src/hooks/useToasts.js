import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_TOASTS = 4;
const DURACION_NORMAL = 4000;
const DURACION_CON_ACCION = 9000;

/**
 * Sistema de toasts propio (no se usa alert()).
 * - Desaparecen solos tras unos segundos (también los de confirmación).
 * - Se pueden cerrar manualmente con dismiss().
 * - Si se envía una `key` repetida, el toast se refresca en lugar de apilarse.
 */
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const temporizadores = useRef(new Map());
  const contador = useRef(0);

  const dismiss = useCallback((id) => {
    clearTimeout(temporizadores.current.get(id));
    temporizadores.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, { type = 'warning', key = null, action = null, duration } = {}) => {
      const id = key ?? `toast-${++contador.current}`;
      const ms = duration ?? (action ? DURACION_CON_ACCION : DURACION_NORMAL);

      clearTimeout(temporizadores.current.get(id));
      temporizadores.current.set(id, setTimeout(() => dismiss(id), ms));

      // `version` reinicia la animación de la barra de progreso al refrescar.
      const version = ++contador.current;
      setToasts((prev) =>
        [...prev.filter((t) => t.id !== id), { id, version, message, type, action, duration: ms }].slice(-MAX_TOASTS)
      );
      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const mapa = temporizadores.current;
    return () => mapa.forEach((t) => clearTimeout(t));
  }, []);

  return { toasts, notify, dismiss };
}
