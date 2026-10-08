import { useEffect, useRef } from 'react';
import { ShoppingBag, ShoppingCart, X } from 'lucide-react';
import CartItem from './CartItem';
import { formatCOP } from '../utils/formatters';

/** Punto 2 y 7: panel lateral del carrito (abre/cierra) con subtotales y total. */
export default function CartDrawer({
  abierto,
  onCerrar,
  items,
  totalUnidades,
  totalCompra,
  onIncrementar,
  onDecrementar,
  onCambiar,
  onQuitar,
  onFinalizar,
  onPegadoInvalido,
}) {
  const botonCerrar = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    botonCerrar.current?.focus();
    const alTeclear = (e) => e.key === 'Escape' && onCerrar();
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="drawer-capa">
      <div className="drawer-fondo" onClick={onCerrar} aria-hidden="true" />

      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Carrito de compras">
        <header className="drawer__cabecera">
          <div className="drawer__titulo">
            <span className="drawer__icono" aria-hidden="true">
              <ShoppingBag size={22} />
            </span>
            <div>
              <h2>Tu carrito</h2>
              <p>
                {totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'}
              </p>
            </div>
          </div>
          <button type="button" ref={botonCerrar} className="btn-icono btn-icono--claro" onClick={onCerrar} aria-label="Cerrar carrito">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        <div className="drawer__cuerpo">
          {items.length === 0 ? (
            <div className="vacio">
              <span className="vacio__icono" aria-hidden="true">
                <ShoppingCart size={36} />
              </span>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega productos desde el catálogo para comenzar tu pedido.</p>
            </div>
          ) : (
            <ul className="lineas">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrementar={onIncrementar}
                  onDecrementar={onDecrementar}
                  onCambiar={onCambiar}
                  onQuitar={onQuitar}
                  onPegadoInvalido={onPegadoInvalido}
                />
              ))}
            </ul>
          )}
        </div>

        <footer className="drawer__pie">
          <dl className="totales">
            <div>
              <dt>Total de unidades</dt>
              <dd data-testid="total-unidades">{totalUnidades}</dd>
            </div>
            <div className="totales__compra">
              <dt>Total de la compra</dt>
              <dd data-testid="total-compra">{formatCOP(totalCompra)}</dd>
            </div>
          </dl>
          <button type="button" className="btn btn--acento btn--ancho" onClick={onFinalizar} disabled={items.length === 0}>
            Finalizar pedido
          </button>
        </footer>
      </aside>
    </div>
  );
}
