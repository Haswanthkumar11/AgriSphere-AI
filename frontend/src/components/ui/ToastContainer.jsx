import { useState, useEffect, useCallback } from 'react';
import { registerToastHandler } from '@utils/toast';

/**
 * ToastContainer — renders the live toast stack.
 * Mount this once in App.jsx inside the app shell.
 */
export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, duration, id }) => {
    setToasts((prev) => [...prev, { message, duration, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration || 2600);
  }, []);

  useEffect(() => {
    registerToastHandler(addToast);
  }, [addToast]);

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">{t.message}</div>
      ))}
    </div>
  );
}
