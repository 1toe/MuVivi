import { Button } from '../UI/Button';
import styles from './EmptyState.module.css';

export function EmptyState({ icon, title, description, action, onAction }) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.icon}>{icon}</div>}
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {action && onAction && (
        <Button
          label={action}
          variant="primary"
          onClick={onAction}
          className={styles.button}
        />
      )}
    </div>
  );
}
