import { Leaf, ShoppingCart } from 'lucide-react';

/** Punto 2: navbar fija, nombre a la izquierda, ícono del carrito a la derecha. */
export default function Navbar({ totalUnidades, onAbrirCarrito, botonCarritoRef }) {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a className="navbar__marca" href="#catalogo" aria-label="TIENDA PALMIRA, ir al catálogo">
          <span className="navbar__logo" aria-hidden="true">
            <Leaf size={22} />
          </span>
          <span className="navbar__nombre">TIENDA PALMIRA</span>
        </a>

        <button
          type="button"
          ref={botonCarritoRef}
          className="navbar__carrito"
          onClick={onAbrirCarrito}
          aria-label={`Abrir carrito, ${totalUnidades} ${totalUnidades === 1 ? 'unidad' : 'unidades'}`}
        >
          <ShoppingCart size={24} aria-hidden="true" />
          {totalUnidades > 0 && (
            // key = totalUnidades reinicia la animación cada vez que cambia el contador
            <span key={totalUnidades} className="navbar__contador" data-testid="contador-carrito">
              {totalUnidades}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
