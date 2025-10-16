import { useState } from 'react';
import { useProject } from '../../hooks/useProject';
import { exportProject } from '../../utils/exportEngine';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import styles from './ExportModal.module.css';

const RESOLUTIONS = [
  { value: '1920x1080', label: '1080p (Full HD)', recommended: false },
  { value: '1280x720', label: '720p (HD)', recommended: true },
  { value: '854x480', label: '480p (SD)', recommended: false },
];

const QUALITY_PRESETS = [
  { value: 'high', label: 'Alta', bitrate: 5000000 },
  { value: 'medium', label: 'Media', bitrate: 2500000 },
  { value: 'low', label: 'Baja', bitrate: 1000000 },
];

export function ExportModal({ isOpen, onClose }) {
  const { state } = useProject();
  const [resolution, setResolution] = useState('1280x720');
  const [quality, setQuality] = useState('medium');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    if (state.clips.length === 0) {
      setError('No hay clips en el timeline para exportar');
      return;
    }

    try {
      setIsExporting(true);
      setProgress(0);
      setError(null);

      await exportProject({
        clips: state.clips,
        backgroundMusic: state.backgroundMusic,
        resolution,
        quality,
        onProgress: (progressValue) => {
          setProgress(progressValue);
        },
      });

      // Export exitoso
      setIsExporting(false);
      setProgress(100);
      
      // Cerrar modal después de 1 segundo
      setTimeout(() => {
        onClose();
        setProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Export failed:', err);
      setError(err.message || 'Error al exportar el video');
      setIsExporting(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      onClose();
      setProgress(0);
      setError(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Exportar Video">
      <div className={styles.exportModal}>
        {/* Resolution Selection */}
        <div className={styles.section}>
          <label className={styles.label}>Resolución</label>
          <div className={styles.options}>
            {RESOLUTIONS.map((res) => (
              <button
                key={res.value}
                className={`${styles.optionButton} ${
                  resolution === res.value ? styles.optionButtonActive : ''
                }`}
                onClick={() => setResolution(res.value)}
                disabled={isExporting}
              >
                {res.label}
                {res.recommended && <span className={styles.badge}>Recomendado</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div className={styles.section}>
          <label className={styles.label}>Calidad</label>
          <div className={styles.options}>
            {QUALITY_PRESETS.map((preset) => (
              <button
                key={preset.value}
                className={`${styles.optionButton} ${
                  quality === preset.value ? styles.optionButtonActive : ''
                }`}
                onClick={() => setQuality(preset.value)}
                disabled={isExporting}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Info */}
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Clips:</span>
            <span className={styles.infoValue}>{state.clips.length}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Duración:</span>
            <span className={styles.infoValue}>
              {Math.floor(state.duration / 60)}:{Math.floor(state.duration % 60)
                .toString()
                .padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {isExporting && (
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={styles.progressText}>
              Exportando... {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            label="Cancelar"
            variant="secondary"
            onClick={handleClose}
            disabled={isExporting}
          />
          <Button
            label={isExporting ? 'Exportando...' : 'Exportar Video'}
            variant="primary"
            onClick={handleExport}
            disabled={isExporting || state.clips.length === 0}
          />
        </div>

        {/* Warning */}
        {!isExporting && (
          <div className={styles.warning}>
            <span className={styles.warningIcon}>ℹ️</span>
            <span className={styles.warningText}>
              El proceso de exportación puede tomar varios minutos dependiendo de la duración
              del video y la configuración seleccionada.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
