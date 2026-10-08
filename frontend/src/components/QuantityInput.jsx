import { useState } from 'react';
import { esSoloDigitos, soloDigitos, teclaPermitida } from '../utils/cantidad';

/**
 * Campo de cantidad reutilizable (catálogo y carrito) - Punto 4.
 *  - onKeyDown : bloquea e, E, +, -, ., , y cualquier tecla que no sea dígito.
 *  - onPaste   : solo acepta texto formado únicamente por dígitos.
 *  - onChange  : sanea el valor (cubre teclados móviles) y entrega un entero.
 *  - onWheel   : quita el foco para que la rueda nunca cambie el valor.
 *
 * Entrega a `onChange` enteros >= 0. El 0 y los valores sobre el stock los
 * resuelve el padre (toast y corrección); aquí nunca se muestra un valor inválido.
 * Mientras el usuario borra para reescribir se muestra vacío SIN notificar al
 * padre, así los totales nunca se calculan con un valor vacío.
 */
export default function QuantityInput({ value, onChange, onInvalidPaste, label, disabled = false }) {
  const [borrador, setBorrador] = useState(null);

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return; // atajos (copiar, pegar, recargar...)
    if (!teclaPermitida(e.key)) e.preventDefault();
  };

  const handlePaste = (e) => {
    const texto = e.clipboardData?.getData('text') ?? '';
    if (!esSoloDigitos(texto)) {
      e.preventDefault();
      onInvalidPaste?.();
    }
  };

  const handleChange = (e) => {
    const limpio = soloDigitos(e.target.value);
    if (limpio === '') {
      setBorrador('');
      return;
    }
    setBorrador(null);
    onChange(parseInt(limpio, 10));
  };

  return (
    <input
      className="qty-input"
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      maxLength={4}
      aria-label={label}
      disabled={disabled}
      value={borrador ?? String(value)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={handleChange}
      onBlur={() => setBorrador(null)}
      onWheel={(e) => e.currentTarget.blur()}
      onDrop={(e) => e.preventDefault()}
    />
  );
}
