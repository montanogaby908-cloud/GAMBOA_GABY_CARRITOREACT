import { Coffee, Cuboid, Wheat, Cookie, Candy, Wine } from 'lucide-react';

// Presentación visual por producto. Se mantiene separado de PRODUCTOS para que
// el array JSON conserve exactamente id, nombre, precio y stock (Punto 1).
export const ICONOS_PRODUCTO = {
  1: { Icono: Coffee, tono: 'tierra' },
  2: { Icono: Cuboid, tono: 'ambar' },
  3: { Icono: Wheat, tono: 'maiz' },
  4: { Icono: Cookie, tono: 'cacao' },
  5: { Icono: Candy, tono: 'rosa' },
  6: { Icono: Wine, tono: 'salvia' },
};

export const ICONO_POR_DEFECTO = { Icono: Candy, tono: 'salvia' };
