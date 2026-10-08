import { Minus, Plus, Trash2 } from 'lucide-react';
import QuantityInput from './QuantityInput';
import { ICONOS_PRODUCTO, ICONO_POR_DEFECTO } from '../data/iconos';
import { formatCOP } from '../utils/formatters';

/** Una línea del carrito: botones −/+, campo de cantidad, subtotal y quitar. */
export default function CartItem({ item, onIncrementar, onDecrementar, onCambiar, onQuitar, onPegadoInvalido }) {
  const { Icono, tono } = ICONOS_PRODUCTO[item.id] ?? ICONO_POR_DEFECTO;

  return (
    <li className="linea">
      <div className={`linea__icono tono--${tono}`} aria-hidden="true">
        <Icono size={26} />
      </div>

      <div className="linea__cuerpo">
        <div className="linea__titulo">
          <h4>{item.nombre}</h4>
          <button
            type="button"
            className="btn-icono btn-icono--peligro"
            onClick={() => onQuitar(item.id)}
            aria-label={`Quitar ${item.nombre} del carrito`}
            title="Quitar del carrito"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="linea__unitario">Precio unitario: {formatCOP(item.precio)}</p>

        <div className="linea__fila">
          <div className="stepper">
            <button
              type="button"
              className="btn-icono"
              onClick={() => onDecrementar(item.id)}
              aria-label={`Disminuir cantidad de ${item.nombre}`}
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <QuantityInput
              value={item.cantidad}
              onChange={(n) => onCambiar(item.id, n)}
              onInvalidPaste={onPegadoInvalido}
              label={`Cantidad de ${item.nombre} en el carrito`}
            />
            <button
              type="button"
              className="btn-icono"
              onClick={() => onIncrementar(item.id)}
              aria-label={`Aumentar cantidad de ${item.nombre}`}
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="linea__subtotal">
            <span>Subtotal</span>
            <strong data-testid={`subtotal-${item.id}`}>{formatCOP(item.subtotal)}</strong>
          </div>
        </div>
      </div>
    </li>
  );
}
