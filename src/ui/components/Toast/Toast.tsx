import { useEffect } from 'react';
import styles from './Toast.module.css';

export type ToastProps = {
  message: string;
  durationMs?: number;
  onDismiss: () => void;
};

const DEFAULT_DURATION_MS = 3000;

/** Notificación temporal tipo Toast accesible (FR-013, FR-016). */
export function Toast({ message, durationMs = DEFAULT_DURATION_MS, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  return (
    <div role="status" aria-live="polite" className={styles.toast}>
      <span className={styles.text}>{message}</span>
    </div>
  );
}
