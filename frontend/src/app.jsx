import { useCallback, useRef, useState } from 'react';
import { Search } from 'lucide-react';

import { PRODUCTOS } from './data/productos';
import { useToasts } from './hooks/useToasts';
import { useCarrito } from './hooks/useCarrito';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';

export default function App() {
  const { toasts, notify, dismiss } = useToasts();
  const carrito = useCarrito(PRODUCTOS, notify);

  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const botonCarritoRef = useRef(null);

  const cerrarCarrito = useCallback(() => {
    setCarritoAbierto(false);
    botonCarritoRef.current?.focus(); // devuelve el foco al ícono (accesibilidad)
  }, []);

  const avisarPegadoInvalido = useCallback(
    () =>
      notify('Solo se permiten números enteros positivos: sin letras, signos, puntos ni comas', {
        type: 'warning',
        key: 'pegado-invalido',
      }),
    [notify]
  );

  const finalizarPedido = () => {
    carrito.vaciar();
    setCarritoAbierto(false);
    notify('¡Pedido registrado con éxito! Gracias por comprar en TIENDA PALMIRA', { type: 'success', key: 'pedido' });
  };

  const visibles = PRODUCTOS.filter((p) => p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()));

  return (
    <>
      <Navbar
        totalUnidades={carrito.totalUnidades}
        onAbrirCarrito={() => setCarritoAbierto(true)}
        botonCarritoRef={botonCarritoRef}
      />

      <main className="contenido" id="catalogo">
        <section className="hero">
          <h1>Productos típicos de la región</h1>
          <p>Elige tus favoritos: el stock se valida en cada paso.</p>
        </section>

        <div className="buscador">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar producto..."
            aria-label="Buscar producto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {visibles.length === 0 ? (
          <p className="sin-resultados">No encontramos productos con ese nombre.</p>
        ) : (
          <div className="grilla">
            {visibles.map((producto, i) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                indice={i}
                enCarrito={carrito.cantidadEnCarrito(producto.id)}
                notify={notify}
                onAgregar={carrito.agregar}
                onPegadoInvalido={avisarPegadoInvalido}
              />
            ))}
          </div>
        )}
      </main>

      <CartDrawer
        abierto={carritoAbierto}
        onCerrar={cerrarCarrito}
        items={carrito.items}
        totalUnidades={carrito.totalUnidades}
        totalCompra={carrito.totalCompra}
        onIncrementar={carrito.incrementar}
        onDecrementar={carrito.decrementar}
        onCambiar={carrito.cambiarCantidad}
        onQuitar={carrito.quitar}
        onFinalizar={finalizarPedido}
        onPegadoInvalido={avisarPegadoInvalido}
      />

      <ToastContainer toasts={toasts} onCerrar={dismiss} />
    </>
  );
}
