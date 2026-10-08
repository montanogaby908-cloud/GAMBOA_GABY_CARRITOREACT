import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import App from '../app.jsx';
import { formatCOP } from '../utils/formatters';

const MAXIMO = 'Este es el máximo de producto disponible en stock';

beforeEach(() => localStorage.clear());
afterEach(cleanup);

const tarjeta = (nombre) => screen.getByRole('article', { name: nombre });
const campoCatalogo = (nombre) => within(tarjeta(nombre)).getByRole('textbox');
const agregar = (nombre) => userEvent.click(within(tarjeta(nombre)).getByRole('button', { name: /agregar/i }));
const abrirCarrito = () => userEvent.click(screen.getByRole('button', { name: /abrir carrito/i }));

async function escribirEnCatalogo(nombre, texto) {
  const campo = campoCatalogo(nombre);
  await userEvent.clear(campo);
  await userEvent.type(campo, texto);
}

describe('Reto carrito de compras - casos de prueba del instructor', () => {
  it('formato COP', () => {
    expect(formatCOP(9800)).toBe('$9.800');
    expect(formatCOP(98400)).toBe('$98.400');
    expect(formatCOP(0)).toBe('$0');
  });

  it('Punto 1: catálogo con los 6 productos exactos', () => {
    render(<App />);
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(screen.getAllByText('$28.500').length).toBeGreaterThan(0);
    expect(screen.getByText('Stock disponible: 3')).toBeTruthy();
  });

  it('1. e, E, +, -, ., , no escriben nada', async () => {
    render(<App />);
    const campo = campoCatalogo('Café de Huila 500 g');
    await userEvent.clear(campo);
    await userEvent.type(campo, 'eE+-.,');
    expect(campo.value).toBe('');
    await userEvent.type(campo, '3');
    expect(campo.value).toBe('3');
  });

  it('2. pegar -5, 3e2 o abc no se pega; pegar dígitos sí', async () => {
    render(<App />);
    const campo = campoCatalogo('Café de Huila 500 g');
    for (const texto of ['-5', '3e2', 'abc']) {
      await userEvent.clear(campo);
      await userEvent.click(campo);
      await userEvent.paste(texto);
      expect(campo.value).toBe('');
    }
    await userEvent.click(campo);
    await userEvent.paste('4');
    expect(campo.value).toBe('4');
  });

  it('3. escribir 0 en el catálogo: conserva el valor y muestra toast de mínimo', async () => {
    render(<App />);
    const campo = campoCatalogo('Café de Huila 500 g');
    await userEvent.clear(campo);
    await userEvent.type(campo, '0');
    expect(campo.value).toBe('1'); // el 0 nunca se muestra: conserva el valor anterior
    expect(screen.getByText('La cantidad mínima es 1')).toBeTruthy();
  });

  it('5. escribir 999 con stock 8 corrige a 8 y muestra el toast', async () => {
    render(<App />);
    await escribirEnCatalogo('Café de Huila 500 g', '999');
    expect(campoCatalogo('Café de Huila 500 g').value).toBe('8');
    expect(screen.getByText(MAXIMO)).toBeTruthy();
  });

  it('6. Panela (stock 3): 2 + 2 queda en 3 con toast', async () => {
    render(<App />);
    await escribirEnCatalogo('Panela orgánica 1 kg', '2');
    await agregar('Panela orgánica 1 kg');
    await escribirEnCatalogo('Panela orgánica 1 kg', '2');
    await agregar('Panela orgánica 1 kg');
    expect(screen.getByText(MAXIMO)).toBeTruthy();
    expect(screen.getByTestId('contador-carrito').textContent).toBe('3');
    await abrirCarrito();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByLabelText('Cantidad de Panela orgánica 1 kg en el carrito').value).toBe('3');
  });

  it('4 y 7 y 8. en el carrito: 0, + en el máximo y − con 1', async () => {
    render(<App />);
    await agregar('Chocolate de mesa'); // stock 1
    await abrirCarrito();
    const campo = screen.getByLabelText('Cantidad de Chocolate de mesa en el carrito');

    // + en el máximo
    await userEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }));
    expect(campo.value).toBe('1');
    expect(screen.getByText(MAXIMO)).toBeTruthy();

    // escribir 0: la cantidad no cambia y sale el toast del mínimo con opción de eliminar
    await userEvent.clear(campo);
    await userEvent.type(campo, '0');
    await userEvent.tab();
    expect(campo.value).toBe('1');
    expect(screen.getByText(/cantidad mínima.*eliminar/i)).toBeTruthy();
  });

  it('8. − con cantidad 1 pide confirmar y al confirmar elimina y recalcula', async () => {
    render(<App />);
    await agregar('Chocolate de mesa');
    await abrirCarrito();
    await userEvent.click(screen.getByRole('button', { name: /disminuir cantidad/i }));
    expect(screen.getByText(/cantidad mínima.*eliminar/i)).toBeTruthy();
    expect(screen.getByTestId('total-compra').textContent).toBe('$15.400'); // aún no se elimina
    await userEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }));
    expect(screen.queryByTestId('subtotal-4')).toBeNull();
    expect(screen.getByTestId('total-compra').textContent).toBe('$0');
    expect(screen.queryByTestId('contador-carrito')).toBeNull(); // contador oculto en 0
  });

  it('botón quitar elimina directamente', async () => {
    render(<App />);
    await agregar('Bocadillo veleño');
    await abrirCarrito();
    await userEvent.click(screen.getByRole('button', { name: /quitar bocadillo/i }));
    expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
  });

  it('9. agregar dos veces el mismo producto: una sola línea', async () => {
    render(<App />);
    await agregar('Arepa de choclo x6');
    await agregar('Arepa de choclo x6');
    await abrirCarrito();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByLabelText('Cantidad de Arepa de choclo x6 en el carrito').value).toBe('2');
  });

  it('10. Café×2, Panela×3, Arepa×1 → subtotales y total $98.400', async () => {
    render(<App />);
    await escribirEnCatalogo('Café de Huila 500 g', '2');
    await agregar('Café de Huila 500 g');
    await escribirEnCatalogo('Panela orgánica 1 kg', '3');
    await agregar('Panela orgánica 1 kg');
    await agregar('Arepa de choclo x6');
    await abrirCarrito();
    expect(screen.getByTestId('subtotal-1').textContent).toBe('$57.000');
    expect(screen.getByTestId('subtotal-2').textContent).toBe('$29.400');
    expect(screen.getByTestId('subtotal-3').textContent).toBe('$12.000');
    expect(screen.getByTestId('total-compra').textContent).toBe('$98.400');
    expect(screen.getByTestId('total-unidades').textContent).toBe('6');
  });

  it('11. al agotar el stock el botón Agregar queda deshabilitado', async () => {
    render(<App />);
    await agregar('Chocolate de mesa');
    const boton = within(tarjeta('Chocolate de mesa')).getByRole('button', { name: /agotado/i });
    expect(boton.disabled).toBe(true);
  });

  it('12. el contador del navbar suma las unidades y se oculta en 0', async () => {
    render(<App />);
    expect(screen.queryByTestId('contador-carrito')).toBeNull();
    await escribirEnCatalogo('Café de Huila 500 g', '2');
    await agregar('Café de Huila 500 g');
    await agregar('Arepa de choclo x6');
    expect(screen.getByTestId('contador-carrito').textContent).toBe('3');
  });

  it('borrar el campo del carrito nunca rompe los totales (sin NaN)', async () => {
    render(<App />);
    await agregar('Café de Huila 500 g');
    await abrirCarrito();
    const campo = screen.getByLabelText('Cantidad de Café de Huila 500 g en el carrito');
    await userEvent.clear(campo);
    expect(screen.getByTestId('total-compra').textContent).toBe('$28.500');
    await userEvent.type(campo, '999');
    expect(campo.value).toBe('8');
    expect(screen.getByTestId('total-compra').textContent).toBe('$228.000');
  });

  it('el panel del carrito abre y se cierra', async () => {
    render(<App />);
    await abrirCarrito();
    expect(screen.getByRole('dialog')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /cerrar carrito/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
