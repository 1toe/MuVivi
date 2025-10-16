import styles from './Button.module.css';

export function Button({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconLeft,
  iconRight,
  className = '',
  ...props
}) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} onClick={onClick} disabled={disabled} {...props}>
      {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
      {label}
      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  );
}
