import { useState } from 'react';
import styles from './Slider.module.css';

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  onChange,
  label,
  showValue = false,
  className = '',
  disabled = false,
  ...props
}) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const percentage = ((localValue - min) / (max - min)) * 100;

  return (
    <div className={`${styles.sliderContainer} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          className={styles.slider}
          disabled={disabled}
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-bg-accent) ${percentage}%, var(--color-bg-accent) 100%)`,
          }}
          {...props}
        />
        
        {showValue && (
          <span className={styles.valueDisplay}>{localValue}</span>
        )}
      </div>
    </div>
  );
}
