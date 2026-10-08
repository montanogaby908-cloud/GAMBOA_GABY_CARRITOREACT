// Utilidades de validación de cantidades (Punto 4 del reto).

/** Deja únicamente dígitos 0-9. */
export const soloDigitos = (texto) => String(texto ?? '').replace(/\D/g, '');

/** true si el texto son únicamente dígitos (sirve para validar el pegado). */
export const esSoloDigitos = (texto) => /^\d+$/.test(String(texto ?? ''));

// Teclas de edición/navegación que sí se permiten además de 0-9.
const TECLAS_EDICION = new Set([
  'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', 'Escape',
]);

/** Decide si una tecla puede llegar al campo de cantidad. */
export function teclaPermitida(key) {
  return /^\d$/.test(key) || TECLAS_EDICION.has(key) || /^F\d{1,2}$/.test(key);
}
