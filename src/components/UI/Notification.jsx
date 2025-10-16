import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Notification.module.css';

export function Notification({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right',
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300); // Animation duration
  };

  if (!isVisible) return null;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const notificationContent = (
    <div
      className={`${styles.notification} ${styles[type]} ${styles[position]} ${
        isExiting ? styles.exiting : ''
      }`}
      role="alert"
    >
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icons[type]}</span>
      </div>
      
      <p className={styles.message}>{message}</p>
      
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );

  return createPortal(notificationContent, document.body);
}

// Notification Container (for stacking multiple notifications)
export function NotificationContainer({ notifications = [] }) {
  return createPortal(
    <div className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>,
    document.body
  );
}
