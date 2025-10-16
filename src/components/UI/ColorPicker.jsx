import { useState, useRef, useEffect } from 'react';
import styles from './ColorPicker.module.css';

const PRESET_COLORS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
];

export function ColorPicker({
  value = '#FFFFFF',
  onChange,
  label,
  showPresets = true,
  className = '',
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  const handlePresetClick = (color) => {
    handleColorChange(color);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.colorPickerContainer} ${className}`} ref={pickerRef}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.pickerWrapper}>
        <button
          type="button"
          className={styles.colorButton}
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: currentColor }}
          aria-label="Choose color"
        >
          <div className={styles.colorPreview} />
        </button>
        
        <input
          type="text"
          value={currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className={styles.colorInput}
          placeholder="#FFFFFF"
          {...props}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.nativePickerWrapper}>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className={styles.nativePicker}
            />
          </div>

          {showPresets && (
            <div className={styles.presetsSection}>
              <p className={styles.presetsLabel}>Presets:</p>
              <div className={styles.presetsGrid}>
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={styles.presetButton}
                    style={{ backgroundColor: color }}
                    onClick={() => handlePresetClick(color)}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
