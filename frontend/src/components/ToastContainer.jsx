import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

const ICONOS = { warning: CircleAlert, confirm: CircleAlert, success: CircleCheck, info: Info };

/**
 * Toasts accesibles: región aria-live (los lectores de pantalla los anuncian),
 * se cierran con la X y desaparecen solos (barra de progreso).
 */
export default function ToastContainer({ toasts, onCerrar }) {
  return (
    <div className="toasts" role="region" aria-label="Notificaciones" aria-live="polite">
      {toasts.map((t) => {
        const Icono = ICONOS[t.type] ?? Info;
        return (
          <div key={`${t.id}-${t.version}`} className={`toast toast--${t.type}`} role={t.type === 'success' || t.type === 'info' ? 'status' : 'alert'}>
            <Icono className="toast__icono" size={22} aria-hidden="true" />
            <div className="toast__cuerpo">
              <p>{t.message}</p>
              {t.action && (
                <button
                  type="button"
                  className="btn btn--peligro btn--chico"
                  onClick={() => {
                    t.action.onClick();
                    onCerrar(t.id);
                  }}
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button type="button" className="btn-icono toast__cerrar" onClick={() => onCerrar(t.id)} aria-label="Cerrar notificación">
              <X size={16} aria-hidden="true" />
            </button>
            <span className="toast__progreso" style={{ animationDuration: `${t.duration}ms` }} aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}
