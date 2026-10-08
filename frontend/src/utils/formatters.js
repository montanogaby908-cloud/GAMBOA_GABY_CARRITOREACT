// Formato de moneda COP: $28.500 (separador de miles con punto, sin decimales).
// Se implementa a mano para que el resultado sea idéntico en todos los navegadores
// (Intl con es-CO omite el separador en números de 4 cifras como 9.800).
export function formatCOP(valor) {
  const entero = Math.round(Number(valor) || 0);
  const signo = entero < 0 ? '-' : '';
  const miles = String(Math.abs(entero)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${signo}$${miles}`;
}
