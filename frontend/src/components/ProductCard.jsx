import { useState } from 'react';
import { ShoppingCart, PackageX } from 'lucide-react';
import QuantityInput from './QuantityInput';
import { ICONOS_PRODUCTO, ICONO_POR_DEFECTO } from '../data/iconos';
import { formatCOP } from '../utils/formatters';
import { MSG_STOCK_MAXIMO } from '../hooks/useCarrito';

/** Punto 3: tarjeta de producto con cantidad (inicia en 1) y botón Agregar. */
export default function ProductCard({ producto, enCarrito, indice, notify, onAgregar, onPegadoInvalido }) {
  const [cantidad, setCantidad] = useState(1);
  const { Icono, tono } = ICONOS_PRODUCTO[producto.id] ?? ICONO_POR_DEFECTO;

  const disponible = producto.stock - enCarrito;
  const agotado = disponible <= 0;
  // La cantidad escrita puede superar lo que queda disponible (stock - carrito):
  // al pulsar Agregar se corrige al máximo y se muestra el toast (Punto 5).
  const cantidadMostrada = cantidad;

  const handleCantidad = (n) => {
    if (n < 1) {
      // 0 no se acepta: conserva el valor anterior y avisa el mínimo.
      notify('La cantidad mínima es 1', { type: 'warning', key: `min-catalogo-${producto.id}` });
      return;
    }
    if (n > producto.stock) {
      setCantidad(producto.stock);
      notify(MSG_STOCK_MAXIMO, { type: 'warning', key: `max-${producto.id}` });
      return;
    }
    setCantidad(n);
  };

  const handleAgregar = () => {
    onAgregar(producto.id, cantidadMostrada);
    setCantidad(1);
  };

  const estado = agotado ? 'agotado' : disponible <= 3 ? 'poco' : 'ok';

  return (
    <article
      className={`card card--${tono} ${agotado ? 'card--agotado' : ''}`}
      style={{ '--i': indice }}
      aria-label={producto.nombre}
    >
      <span className={`card__stock card__stock--${estado}`}>
        {agotado ? 'Sin stock disponible' : `Stock disponible: ${disponible}`}
      </span>

      <div className="card__icono" aria-hidden="true">
        <Icono size={44} strokeWidth={1.75} />
      </div>

      <h3 className="card__nombre">{producto.nombre}</h3>
      <p className="card__precio">{formatCOP(producto.precio)}</p>
      {enCarrito > 0 && <p className="card__en-carrito">{enCarrito} en tu carrito</p>}

      <div className="card__acciones">
        <label className="card__cantidad">
          <span>Cantidad</span>
          <QuantityInput
            value={cantidadMostrada}
            onChange={handleCantidad}
            onInvalidPaste={onPegadoInvalido}
            label={`Cantidad de ${producto.nombre}`}
            disabled={agotado}
          />
        </label>

        <button type="button" className="btn btn--primario" onClick={handleAgregar} disabled={agotado}>
          {agotado ? <PackageX size={18} aria-hidden="true" /> : <ShoppingCart size={18} aria-hidden="true" />}
          {agotado ? 'Agotado' : 'Agregar'}
        </button>
      </div>
    </article>
  );
}
